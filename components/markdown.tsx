"use client";

import "katex/dist/katex.min.css";

import type { ComponentProps } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

const Markdown = (props: ComponentProps<typeof ReactMarkdown>) => {
  return (
    <div className="prose dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        {...props}
      />
    </div>
  );
};

export default Markdown;
