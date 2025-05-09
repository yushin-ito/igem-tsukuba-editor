import { Extension } from "@tiptap/core";

const RightArrowConversionExtension = Extension.create({
  name: "RightArrowConversion",

  addInputRules() {
    return [
      {
        find: /->/g,
        handler: ({ state, range, chain }) => {
          const { from, to } = range;
          const tr = state.tr.replaceWith(from, to, state.schema.text("→"));
          chain().insertContent(tr).run();
        },
      },
    ];
  },
});

export default RightArrowConversionExtension