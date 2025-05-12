"use client";

import {
  useComponentsContext,
  useEditorContentOrSelectionChange,
} from "@blocknote/react";
import {
  BlockNoteEditor,
  createStronglyTypedTiptapNode,
  createInternalInlineContentSpec,
} from "@blocknote/core";
import {
  NodeViewProps,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import { mergeAttributes } from "@tiptap/core";
import {
  ChangeEvent,
  useEffect,
  useState,
  useRef,
  useCallback,
  forwardRef,
  MouseEvent as ReactMouseEvent,
  TextareaHTMLAttributes,
  RefObject,
} from "react";
import katex from "katex";
import { Decoration, DecorationSource } from "prosemirror-view";
import { useTranslations } from "next-intl";

import Icons from "@/components/icons";
import { cn, wait } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

declare module "prosemirror-view" {
  interface NodeView {
    decorations: {
      decorations: Decoration[];
      innerDecorations: DecorationSource;
    };
  }
}

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  autofocus?: boolean;
}

const TextareaView = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ autofocus = false, ...props }, ref) => {
    useEffect(() => {
      (async () => {
        // todo: better way to wait for the textarea to be mounted.
        await wait(0.2);
        const element = ref as RefObject<HTMLTextAreaElement>;
        if (autofocus && element.current) {
          element.current.setSelectionRange(0, element.current.value.length);
          element.current.focus();
        }
      })();
    }, [autofocus, ref]);

    return (
      <Textarea
        ref={ref}
        className="equation-textarea min-h-[80px] min-w-[240px] resize-none rounded-none border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        {...props}
      />
    );
  }
);

const InlineEquationView = () => {
  return function (this: { options: { editor: BlockNoteEditor } }) {
    const BlockContent = (props: NodeViewProps) => {
      const t = useTranslations("editor.inline_equation");
      const editor: BlockNoteEditor = this.options.editor;
      const content = props.node.textContent;
      const nodeSize = props.node.nodeSize;
      const textareaRef = useRef<HTMLTextAreaElement | null>(null);
      const contentRef = useRef<HTMLElement | null>(null);
      const containerRef = useRef<HTMLElement | null>(null);
      const [html, setHtml] = useState("");
      const [isOpen, setIsOpen] = useState(!content);
      const [isEdge, setIsEdge] = useState(!content);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const Components = useComponentsContext()!;

      const getTextareaEdge = () => {
        const $textarea = textareaRef.current;
        if (!$textarea) {
          return {};
        }

        return {
          isLeftEdge:
            $textarea.selectionStart === 0 && $textarea.selectionEnd === 0,
          isRightEdge:
            $textarea.selectionStart === $textarea.value.length &&
            $textarea.selectionEnd === $textarea.value.length,
        };
      };

      useEffect(() => {
        const html = katex.renderToString(content, {
          throwOnError: false,
        });
        setHtml(html);
      }, [content]);

      useEditorContentOrSelectionChange(() => {
        const pos = props.getPos?.();
        const from = editor._tiptapEditor.state.selection.from;
        const selection = editor.getSelection();

        setIsEdge(!selection && (from === pos + nodeSize || from === pos));
      });

      useEffect(() => {
        if (isOpen) {
          contentRef.current?.click();
        }
      }, [isOpen]);

      const onEnter = useCallback(
        (event: ReactMouseEvent | KeyboardEvent) => {
          const pos = props.getPos?.();
          event.preventDefault();
          if (!content) {
            const node = props.node;
            const view = editor._tiptapEditor.view;

            const tr = view?.state.tr.delete(pos, pos + node.nodeSize);

            if (tr) {
              view?.dispatch(tr);
            }
            editor._tiptapEditor.commands.setTextSelection(pos);
          } else {
            editor._tiptapEditor.commands.setTextSelection(pos + nodeSize);
          }
          editor.focus();
          setIsOpen(false);
          setIsEdge(true);
        },
        [content, editor, nodeSize, props]
      );

      const onMenuNavigationKeys = useCallback(
        (event: KeyboardEvent) => {
          const textareaEdge = getTextareaEdge();
          const pos = props.getPos?.();
          const from = editor._tiptapEditor.state.selection.from;

          if (event.key === "ArrowLeft") {
            if (from === pos + nodeSize && !isOpen) {
              setIsOpen(true);
            }
            if (textareaEdge.isLeftEdge) {
              event.preventDefault();
              editor.focus();
              editor._tiptapEditor.commands.setTextSelection(pos);
              setIsOpen(false);
            }
            return true;
          }

          if (event.key === "ArrowRight") {
            if (from === pos && !isOpen) {
              setIsOpen(true);
            }
            if (textareaEdge.isRightEdge) {
              event.preventDefault();
              editor.focus();
              editor._tiptapEditor.commands.setTextSelection(pos + nodeSize);
              setIsOpen(false);
            }
            return true;
          }

          if (event.key === "Enter" && isOpen) {
            onEnter(event);
            return true;
          }

          return false;
        },
        [editor, isOpen, onEnter, nodeSize, props]
      );

      useEffect(() => {
        if (isOpen || isEdge) {
          editor.domElement?.addEventListener(
            "keydown",
            onMenuNavigationKeys,
            true
          );
        }

        return () => {
          editor.domElement?.removeEventListener(
            "keydown",
            onMenuNavigationKeys,
            true
          );
        };
      }, [editor.domElement, isOpen, onMenuNavigationKeys, isEdge]);

      const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        const pos = props.getPos?.();
        const node = props.node;
        const view = editor._tiptapEditor.view;

        if (view) {
          const tr = view.state.tr.replaceWith(
            pos,
            pos + node.nodeSize,
            view.state.schema.nodes.inlineEquation.create(
              {
                ...node.attrs,
              },
              value ? view.state.schema.text(value) : null
            )
          );

          view.dispatch(tr);
        }

        setIsOpen(true);
      };

      useEffect(() => {
        const onPointerUp = (event: MouseEvent) => {
          if (
            containerRef.current &&
            !containerRef.current.contains(event.target as Node)
          ) {
            setIsOpen(false);
          }
        };

        document.addEventListener("pointerup", onPointerUp, true);
        return () => {
          document.removeEventListener("pointerup", onPointerUp, true);
        };
      }, []);

      return (
        <NodeViewWrapper as="span" ref={containerRef}>
          <Components.Generic.Popover.Root opened={isOpen}>
            <Components.Generic.Popover.Trigger>
              <span
                ref={contentRef}
                className={cn(`equation${isOpen ? " focus" : ""}`)}
              >
                {!content ? (
                  <span
                    className="equation-empty whitespace-nowrap rounded p-1 text-muted-foreground"
                    onClick={() => setIsOpen(true)}
                  >
                    {t("empty_placeholder")}
                  </span>
                ) : (
                  <span
                    className="equation-content whitespace-nowrap rounded p-1"
                    onClick={() => setIsOpen(true)}
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                )}
              </span>
            </Components.Generic.Popover.Trigger>
            <Components.Generic.Popover.Content
              className="bn-popover-content bn-form-popover"
              variant="form-popover"
            >
              <Label className="equation-label flex p-2">
                <TextareaView
                  ref={textareaRef}
                  placeholder="c^2 = a^2 + b^2"
                  autofocus
                  value={content}
                  onChange={onChange}
                />
                <Button className="equation-enter px-3" onClick={onEnter}>
                  <span>{t("done")}</span>
                  <Icons.cornerDownLeft />
                </Button>
              </Label>
            </Components.Generic.Popover.Content>
          </Components.Generic.Popover.Root>
        </NodeViewWrapper>
      );
    };

    return (props: NodeViewProps) => {
      const nodeView = ReactNodeViewRenderer(BlockContent, {
        stopEvent: () => true,
      })(props);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      nodeView.contentDOMElement = undefined;

      const update = nodeView.update?.bind(nodeView);
      nodeView.update = (node, outerDeco, innerDeco) => {
        let decorations = nodeView.decorations;
        if (
          nodeView.decorations.decorations !== outerDeco ||
          nodeView.decorations.innerDecorations !== innerDeco
        ) {
          decorations = {
            decorations: [...outerDeco],
            innerDecorations: innerDeco,
          };
        }

        return (
          update?.(node, decorations.decorations, undefined as never) ?? false
        );
      };
      return nodeView;
    };
  };
};

const node = createStronglyTypedTiptapNode({
  name: "inlineEquation",
  inline: true,
  group: "inline",
  content: "inline*",
  editable: true,
  selectable: false,
  parseHTML() {
    return [
      {
        tag: "inlineEquation",
        priority: 200,
        node: "inlineEquation",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "inlineEquation",
      mergeAttributes(HTMLAttributes, {
        "data-content-type": this.name,
      }),
      0,
    ];
  },

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  addNodeView: InlineEquationView(),
});

export const InlineEquation = createInternalInlineContentSpec(
  {
    content: "styled",
    type: "inlineEquation",
    propSchema: {},
  },
  {
    node,
  }
);
