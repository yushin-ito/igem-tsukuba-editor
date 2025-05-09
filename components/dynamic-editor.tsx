"use client";

import dynamic from "next/dynamic";

const DynamicEditor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});

export default DynamicEditor;
