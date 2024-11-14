<template>
    <div class="container">
        <div>
            <MarkdownEditor v-model="content" />
        </div>
        <div class="card">
            <h3>markdown输出</h3>
            <textarea v-model="content" />
        </div>
    </div>
</template>

<script setup lang="ts">
import MarkdownEditor from '@/components/editor/Markdown.vue'
import { ref } from 'vue';
import md from '../../README.md'
const content = ref(md)
</script>
