import { Extension } from "@tiptap/core";
import MarkdownIt from "markdown-it";
import {
  defaultMarkdownSerializer,
  MarkdownSerializer,
  MarkdownSerializerState,
} from "@tiptap/pm/markdown";
import {
  DOMParser as ProseMirrorDomParser, // 重命名,防止冲突,web运行环境还有个 DOMParser
  type Node,
  type Schema,
} from "@tiptap/pm/model";
import Bold from "@tiptap/extension-bold";
import Strike from "@tiptap/extension-strike";
import Italic from "@tiptap/extension-italic";
import Image from "@tiptap/extension-image";

export const md = MarkdownIt();
export const parser = new DOMParser();

// handler how to markdown format
const options = {
  marks: {
    ...defaultMarkdownSerializer.marks,
    [Bold.name]: defaultMarkdownSerializer.marks.strong,
    [Strike.name]: {
      open: "~~",
      close: "~~",
      mixable: true,
      expelEnclosingWhitespace: false,
    },
    [Italic.name]: {
      open: "_",
      close: "_",
      mixable: true,
      expelEnclosingWhitespace: true,
    },
  },
  nodes: {
    ...defaultMarkdownSerializer.nodes,
    [Image.name]: (state: MarkdownSerializerState, node: Node) => {
      // ![pinia logo](https://pinia.vuejs.org/logo.svg)
      state.write(`![${node.attrs.alt}](${node.attrs.src})`)
    }
  },
};

const serializer = new MarkdownSerializer(options.nodes, options.marks);

export const MarkdownExtension = Extension.create<{
  options: typeof options;
  serializer: MarkdownSerializer;
}>({
  name: "markdown_format",
  addOptions() {
    return {
      serializer,
      options,
    };
  },
});

// document -> markdown
export const serialize = (content: Node) => {
  return serializer.serialize(content);
};
// markdown -> HtmlElement -> Node
export const parse = (content: string, schema: Schema) => {
  const html = md.render(content);
  if (!html) return null;
  console.log('html', html)
  const { body } = parser.parseFromString(html, "text/html");
  const state = ProseMirrorDomParser.fromSchema(schema).parse(body);
  console.log('json', state.toJSON())
  return state.toJSON();
};
