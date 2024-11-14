<template>
    <div class="container">
        <div>
            <WebEditor v-model="content" />
        </div>
        <div class="card">
            <h3>html输出</h3>
            <textarea v-model="content" />
        </div>
    </div>
</template>

<script setup lang="ts">
import WebEditor from '@/components/editor/Tiptap.vue'
import { ref } from 'vue';
const content = ref(`<div id="app"><p>app</p></div>`)
</script>
