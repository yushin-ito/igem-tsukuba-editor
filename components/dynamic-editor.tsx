"use client";

import dynamic from "next/dynamic";

const DynamicEditor = dynamic(() => import("@/components/editor"), {
  ssr: false,
  loading: () => null,
});

export default DynamicEditor;
