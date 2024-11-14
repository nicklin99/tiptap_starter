<template>
  <div id="app">
    <h2>可视化编辑器<a href="https://github.com/ueberdosis/tiptap">tiptap</a>试验区域</h2>
    <p>Tiptap是基于ProseMirMirror是一个用于构建富文本所见即所得编辑器的工具包，从可定制的构建块中创建您想要的富文本编辑器。Tiptap提供了合理的默认值、大量扩展和友好的API来定制各个方面。</p>
    <div>
      <h2>示例</h2>
      <nav>
        <router-link to="/">
          <h3>web html编辑器</h3>
        </router-link>
        <router-link to="/about">
          <h3>markdown编辑器</h3>
        </router-link>
      </nav>
    </div>
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'App',
  data() {
    return {
      content: '<p>h2</p>',
      markdown: 'h2',
    }
  }
})
</script>