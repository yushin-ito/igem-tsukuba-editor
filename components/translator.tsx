"use client";

import { Post } from "@prisma/client";
import { useCallback, useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import Icons from "@/components/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { translatorSchema } from "@/schemas/post";
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
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import TranslateButton from "@/components/translate-button";
import {
  EmptyPlaceholder,
  EmptyPlaceholderTitle,
  EmptyPlaceholderDescription,
} from "@/components/empty-placeholder";
import Markdown from "@/components/markdown";

interface TranslatorProps {
  post: Pick<Post, "id" | "title" | "content" | "translation">;
}

type FormData = z.infer<typeof translatorSchema>;

const Translator = ({ post }: TranslatorProps) => {
  const t = useTranslations("translator");
  const router = useRouter();
  const {
    register,
    watch,
    reset,
    handleSubmit,
    formState: { isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(translatorSchema),
    defaultValues: {
      translation: post.translation ?? undefined,
    },
  });
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const onSubmit = useCallback(
    async (data: FormData) => {
      startTransition(async () => {
        const response = await fetch(`/api/posts/${post.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            translation: data.translation,
          }),
        });

        if (!response.ok) {
          toast.error(t("error.save.title"), {
            description: t("error.save.description"),
          });

          return;
        }

        reset(data);
        router.refresh();

        toast.success(t("success.save.title"), {
          description: t("success.save.description"),
        });
      });
    },
    [post.id, reset, router, t]
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
            <TranslateButton postId={post.id} />
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
        <div className="container mt-10 max-w-7xl space-y-10 px-5 md:grid md:grid-cols-2 md:space-x-10 md:space-y-0">
          <div className="flex flex-col space-y-2">
            <Tabs defaultValue="markdown" className="space-y-4">
              <TabsList>
                <TabsTrigger value="markdown">{t("markdown")}</TabsTrigger>
                <TabsTrigger value="preview" disabled={!post.content}>
                  {t("preview")}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="markdown">
                <Card className="relative h-[480px] overflow-hidden shadow-none">
                  <CardContent className="p-0">
                    {post.content ? (
                      <>
                        <Textarea
                          readOnly
                          defaultValue={post.content}
                          className="min-h-[440px] resize-none rounded-none border-none p-6 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                        <div className="absolute inset-x-0 bottom-0 flex h-10 items-center justify-between px-4">
                          <Label>{t("japanese")}</Label>
                          <span className="text-xs text-muted-foreground">
                            {t("char", { count: post.content?.length ?? 0 })}
                          </span>
                        </div>
                      </>
                    ) : (
                      <EmptyPlaceholder className="border-none p-0">
                        <EmptyPlaceholderTitle>
                          {t("empty_placeholder.title")}
                        </EmptyPlaceholderTitle>
                        <EmptyPlaceholderDescription>
                          {t("empty_placeholder.description")}
                        </EmptyPlaceholderDescription>
                        <Link
                          href={`/editor/${post.id}`}
                          className={cn(
                            buttonVariants(),
                            "px-8 py-6 rounded-full"
                          )}
                        >
                          {t("open_editor")}
                        </Link>
                        <div className="absolute inset-x-0 bottom-0 flex h-10 items-center px-4">
                          <Label>{t("japanese")}</Label>
                        </div>
                      </EmptyPlaceholder>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="preview">
                <Card className="relative h-[480px] overflow-hidden shadow-none">
                  <CardContent className="p-0">
                    <div className="h-[440px] overflow-y-scroll p-6">
                      <Markdown>{post.content}</Markdown>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 flex h-10 items-center justify-between px-4">
                      <Label>{t("japanese")}</Label>
                      <span className="text-xs text-muted-foreground">
                        {t("char", { count: post.content?.length ?? 0 })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          <div className="flex flex-col space-y-2">
            <Tabs defaultValue="markdown" className="space-y-4">
              <TabsList>
                <TabsTrigger value="markdown">{t("markdown")}</TabsTrigger>
                <TabsTrigger value="preview" disabled={!post.translation}>
                  {t("preview")}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="markdown">
                <Card className="relative min-h-[480px] overflow-hidden shadow-none">
                  <CardContent className="p-0">
                    <Textarea
                      id="translation"
                      placeholder={t("translation_placeholder")}
                      defaultValue={post.translation ?? ""}
                      className="min-h-[440px] resize-none rounded-none border-none p-6 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      {...register("translation")}
                    />
                    <div className="absolute inset-x-0 bottom-0 flex h-10 items-center justify-between px-4">
                      <Label>{t("english")}</Label>
                      <span className="text-xs text-muted-foreground">
                        {t("char", {
                          count: watch("translation")?.length ?? 0,
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="preview">
                <Card className="relative h-[480px] overflow-hidden shadow-none">
                  <CardContent className="p-0">
                    <div className="h-[440px] overflow-y-scroll p-6">
                      <Markdown>{post.translation}</Markdown>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 flex h-10 items-center justify-between px-4">
                      <Label>{t("english")}</Label>
                      <span className="text-xs text-muted-foreground">
                        {t("char", {
                          count: watch("translation")?.length ?? 0,
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </form>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("dialog.unsaved.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("dialog.unsaved.description")}
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

export default Translator;
