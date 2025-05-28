"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import "@/styles/editor.css";
import "katex/dist/katex.min.css";

import { codeBlock } from "@blocknote/code-block";
import { BlockNoteView } from "@blocknote/mantine";
import {
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
  useCreateBlockNote,
} from "@blocknote/react";
import { en, ja } from "@blocknote/core/locales";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import TextareaAutosize from "react-textarea-autosize";
import { useCallback, useEffect, useState, useTransition } from "react";
import { useTheme } from "next-themes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Post, User } from "@prisma/client";
import { toast } from "sonner";
import { CharacterCount } from "@tiptap/extension-character-count";
import { useRouter } from "next/navigation";
import YPartyKitProvider from "y-partykit/provider";
import * as Y from "yjs";
import {
  BlockNoteSchema,
  defaultInlineContentSpecs,
  filterSuggestionItems,
} from "@blocknote/core";

import Icons from "@/components/icons";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { editorSchema } from "@/schemas/post";
import LeftArrowConversionExtension from "@/extensions/left-arrow-conversion-extension";
import RightArrowConversionExtension from "@/extensions/right-arrow-conversion-extension";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { InlineEquation } from "@/components/inline-equation";
import env from "@/env";

interface EditorProps {
  user: Pick<User, "id" | "name" | "color">;
  post: Pick<Post, "id" | "title" | "blocks" | "published">;
}

type FormData = z.infer<typeof editorSchema>;

const schema = BlockNoteSchema.create({
  inlineContentSpecs: {
    ...defaultInlineContentSpecs,
    inlineEquation: InlineEquation,
  },
});

const colors = {
  red: "#dc2626",
  rose: "#e11d48",
  orange: "#ea580c",
  green: "#16a34a",
  blue: "#2563eb",
  yellow: "#ca8a04",
  violet: "#7c3aed",
};

const Editor = ({ user, post }: EditorProps) => {
  const t = useTranslations("editor");
  const router = useRouter();
  const locale = useLocale();
  const { resolvedTheme } = useTheme();
  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(editorSchema),
  });
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const doc = new Y.Doc();
  const provider = new YPartyKitProvider(
    env.NEXT_PUBLIC_PARTYKIT_HOST,
    post.id,
    doc
  );

  const dictionary = locale === "ja" ? ja : en;

  const insertLaTex = (editor: typeof schema.BlockNoteEditor) => ({
    icon: <Icons.formula className="size-[18px]" />,
    title: t("inline_equation.title"),
    key: "inlineEquation",
    subtext: t("inline_equation.description"),
    aliases: ["equation", "latex", "katex"],
    group: t("other"),
    onItemClick: () => {
      const view = editor._tiptapEditor.view;
      const pos = editor._tiptapEditor.state.selection.from;
      if (view) {
        const tr = view.state.tr.insert(
          pos,
          view.state.schema.nodes.inlineEquation.create()
        );
        view.dispatch(tr);
      }
    },
  });

  const uploadFile = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append("bucket", "images");
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        toast.error(t("error.upload.title"), {
          description: t("error.upload.description"),
        });
        return "";
      }

      const blob = await response.json();

      return blob.url;
    },
    [t]
  );

  const editor = useCreateBlockNote({
    schema,
    initialContent: JSON.parse(post.blocks as string),
    codeBlock,
    uploadFile,
    dictionary: {
      ...dictionary,
      placeholders: {
        emptyDocument: t("content_placeholder"),
      },
    },
    collaboration: {
      provider,
      fragment: doc.getXmlFragment("document-store"),
      user: {
        name: user.name || t("unknown_user"),
        color: colors[user.color as keyof typeof colors] || "#ffffff"
      },
      showCursorLabels: "always"
    },
    pasteHandler: ({ event, defaultPasteHandler }) => {
      try {
        return defaultPasteHandler();
      } catch (error) {
        if (event.clipboardData?.types.includes("text/plain")) {
          editor.pasteText(event.clipboardData.getData("text/plain"));
          return true;
        }
        throw error;
      }
    },
    _tiptapOptions: {
      extensions: [
        LeftArrowConversionExtension,
        RightArrowConversionExtension,
        CharacterCount.configure({
          limit: 10000,
        }),
      ],
    },
  });

  const [count, setCount] = useState(
    editor._tiptapEditor.storage.characterCount.characters()
  );

  const onSubmit = useCallback(
    (data: FormData) => {
      startTransition(async () => {
        const text = editor._tiptapEditor.getText();
        const markdown = await editor.blocksToMarkdownLossy(editor.document);
        const blocks = JSON.stringify(editor.document);

        const response = await fetch(`/api/posts/${post.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: data.title,
            description: text.slice(0, 100),
            content: markdown,
            blocks,
          }),
        });

        if (!response.ok) {
          toast.error(t("error.save.title"), {
            description: t("error.save.description"),
          });

          return;
        }

        router.refresh();

        toast.success(t("success.title"), {
          description: t("success.description"),
        });

        setIsDirty(false);
      });
    },
    [post.id, editor, router, t]
  );

  useEffect(() => {
    window.history.pushState(null, "", window.location.pathname);

    const onPopState = () => {
      if (isDirty) {
        setOpen(true);
      }
    };

    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
      }
    };

    window.addEventListener("popstate", onPopState);
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [isDirty, setOpen]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "pl-2 flex items-center"
            )}
            onNavigate={(e) => {
              if (isDirty) {
                e.preventDefault();
                setOpen(true);
              }
            }}
          >
            <Icons.chevronLeft className="size-8" />
            <span className="text-sm">{t("back")}</span>
          </Link>
          <div className="flex items-center space-x-6">
            <span className="text-sm text-muted-foreground">
              {t("char", { count })}
            </span>
            <Button
              type="submit"
              className={cn({ "cursor-not-allowed opacity-60": isPending })}
              disabled={isPending}
            >
              {isPending ? (
                <Icons.spinner className="size-4 animate-spin" />
              ) : (
                <span>{t("save")}</span>
              )}
            </Button>
          </div>
        </div>
        <div className="container mx-auto max-w-3xl space-y-4 px-5 pb-[320px] pt-10">
          <TextareaAutosize
            id="title"
            defaultValue={post.title}
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold leading-tight focus:outline-none"
            {...register("title")}
            onChange={(e) => {
              setIsDirty(true);
              register("title").onChange(e);
            }}
          />
          <BlockNoteView
            theme={resolvedTheme as "light" | "dark"}
            editor={editor}
            slashMenu={false}
            onChange={() => {
              setIsDirty(true);
              setCount(
                editor._tiptapEditor.storage.characterCount.characters()
              );
            }}
          >
            <SuggestionMenuController
              triggerCharacter={"/"}
              getItems={async (query) =>
                filterSuggestionItems(
                  [
                    ...getDefaultReactSlashMenuItems(editor),
                    insertLaTex(editor),
                  ],
                  query
                )
              }
            />
          </BlockNoteView>
        </div>
      </form>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("dialog.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("dialog.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() =>
                window.history.pushState(null, "", window.location.pathname)
              }
            >
              {t("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push("/dashboard")}>
              {t("continue")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Editor;
