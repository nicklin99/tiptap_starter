<template>
  <div class="card">
    <div class="control-group">
      <div v-if="editor" class="button-group">
        <button @click="editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()">
          Insert table
        </button>
        <button @click="editor.chain().focus().toggleBold().run()"
          :disabled="!editor.can().chain().focus().toggleBold().run()"
          :class="{ 'is-active': editor.isActive('bold') }">
          Bold
        </button>
        <button @click="editor.chain().focus().toggleItalic().run()"
          :disabled="!editor.can().chain().focus().toggleItalic().run()"
          :class="{ 'is-active': editor.isActive('italic') }">
          Italic
        </button>
        <button @click="editor.chain().focus().toggleStrike().run()"
          :disabled="!editor.can().chain().focus().toggleStrike().run()"
          :class="{ 'is-active': editor.isActive('strike') }">
          Strike
        </button>
        <button @click="editor.chain().focus().toggleCode().run()"
          :disabled="!editor.can().chain().focus().toggleCode().run()"
          :class="{ 'is-active': editor.isActive('code') }">
          Code
        </button>
        <button @click="editor.chain().focus().unsetAllMarks().run()">
          Clear marks
        </button>
        <button @click="editor.chain().focus().clearNodes().run()">
          Clear nodes
        </button>
        <button @click="editor.chain().focus().setParagraph().run()"
          :class="{ 'is-active': editor.isActive('paragraph') }">
          Paragraph
        </button>
        <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
          H1
        </button>
        <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
          H2
        </button>
        <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
          H3
        </button>
        <button @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }">
          H4
        </button>
        <button @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }">
          H5
        </button>
        <button @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }">
          H6
        </button>
        <button @click="editor.chain().focus().toggleBulletList().run()"
          :class="{ 'is-active': editor.isActive('bulletList') }">
          Bullet list
        </button>
        <button @click="editor.chain().focus().toggleOrderedList().run()"
          :class="{ 'is-active': editor.isActive('orderedList') }">
          Ordered list
        </button>
        <button @click="editor.chain().focus().toggleCodeBlock().run()"
          :class="{ 'is-active': editor.isActive('codeBlock') }">
          Code block
        </button>
        <button @click="editor.chain().focus().toggleBlockquote().run()"
          :class="{ 'is-active': editor.isActive('blockquote') }">
          Blockquote
        </button>
        <button @click="editor.chain().focus().setHorizontalRule().run()">
          Horizontal rule
        </button>
        <button @click="editor.chain().focus().setHardBreak().run()">
          Hard break
        </button>
        <button @click="editor.chain().focus().undo().run()" :disabled="!editor.can().chain().focus().undo().run()">
          Undo
        </button>
        <button @click="editor.chain().focus().redo().run()" :disabled="!editor.can().chain().focus().redo().run()">
          Redo
        </button>
      </div>
    </div>
    <editor-content :editor="editor" />
  </div>

</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Highlight from '@tiptap/extension-highlight'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'
import Image from '@tiptap/extension-image'
import { InlineImage } from './md_config'
import { parse, serialize } from './extension/markdown'
// starterKit 包含的插件
// https://tiptap.dev/docs/editor/extensions/functionality/starterkit
export default defineComponent({
  components: {
    EditorContent,
  },
  props: {
    modelValue: {
      type: String,
      default: '',
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      editor: null as Editor | null,
    }
  },
  mounted() {
    let value = this.modelValue
    // @ts-ignore
    this.editor = new Editor({
      extensions: [
        StarterKit,
        Image,
        InlineImage,
        Table.configure({
          resizable: true,
        }),
        TableRow,
        TableHeader,
        TableCell,
        Highlight,
      ],
      onCreate({ editor }) {
        const content = parse(value, editor.schema)
        editor.commands.setContent(content)
        console.debug("editor.schema", editor.schema)
      },
      onUpdate: () => {
        console.debug(JSON.stringify(this.editor?.getJSON()))
        this.$emit('update:modelValue', serialize(this.editor?.$doc.node!))
      },
    })
  },

  beforeUnmount() {
    this.editor?.destroy()
  },
})
</script>

<style lang="scss">
@import "./style.scss";
</style>