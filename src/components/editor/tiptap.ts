
  import { Node, DOMParser as ProseMirrorDOMParser } from '@tiptap/pm/model'
  import { 
    MarkdownSerializerState,
    defaultMarkdownSerializer,
    MarkdownSerializer as ProseMirrorMarkdownSerializer
} from '@tiptap/pm/markdown'
  import MarkdownIt from "markdown-it"

  import Paragraph from "@tiptap/extension-paragraph";
  import BulletList from "@tiptap/extension-bullet-list";
  import ListItem from "@tiptap/extension-list-item";
  import OrderedList from "@tiptap/extension-ordered-list";
  import Strike from "@tiptap/extension-strike";
  import Italic from "@tiptap/extension-italic";
  import HorizontalRule from "@tiptap/extension-horizontal-rule";
  import HardBreak from "@tiptap/extension-hard-break";
  import Code from "@tiptap/extension-code";
  import Bold from "@tiptap/extension-bold";
  import Blockquote from "@tiptap/extension-blockquote";
  import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
  import Link from "@tiptap/extension-link";

  const serializerMarks = {
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
    [Code.name]: defaultMarkdownSerializer.marks.code,
    [Link.name]: {
      open(state, mark, parent, index) {
        return isPlainURL(mark, parent, index, 1) ? "<" : "[";
      },
      close(state, mark, parent, index) {
        const href = mark.attrs.canonicalSrc || mark.attrs.href;
  
        return isPlainURL(mark, parent, index, -1)
          ? ">"
          : `](${state.esc(href)}${
              mark.attrs.title ? ` ${state.quote(mark.attrs.title)}` : ""
            })`;
      },
    },
  };
  const serializerNodes = {
    ...defaultMarkdownSerializer.nodes,
    [Paragraph.name]: defaultMarkdownSerializer.nodes.paragraph,
    [BulletList.name]: defaultMarkdownSerializer.nodes.bullet_list,
    [ListItem.name]: defaultMarkdownSerializer.nodes.list_item,
    [HorizontalRule.name]: defaultMarkdownSerializer.nodes.horizontal_rule,
    [HardBreak.name]: defaultMarkdownSerializer.nodes.hard_break,
    [CodeBlockLowlight.name]: defaultMarkdownSerializer.nodes.code_block,
    [OrderedList.name]: defaultMarkdownSerializer.nodes.ordered_list,
    [Blockquote.name]: (state: MarkdownSerializerState, node: Node) => {
      if (node.attrs.multiline) {
        state.write(">>>");
        state.ensureNewLine();
        state.renderContent(node);
        state.ensureNewLine();
        state.write(">>>");
        state.closeBlock(node);
      } else {
        state.wrapBlock("> ", null, node, () => state.renderContent(node));
      }
    },
  };
  const md = MarkdownIt()
  const parser = new DOMParser();
  const serializer = new ProseMirrorMarkdownSerializer(
    serializerNodes,
    serializerMarks
  );
export const parse = (schema, content) => {
    const html = md.render(content)
    if (!html) return null;
    const { body } = parser.parseFromString(html, "text/html");
    body.append(document.createComment(content));
    const state = ProseMirrorDOMParser.fromSchema(schema).parse(body);
    return state.toJSON();
}

export const serialize = (schema, content) => {
    const proseMirrorDocument = schema.nodeFromJSON(content);
    return serializer.serialize(proseMirrorDocument, {
      tightLists: true,
    });
}