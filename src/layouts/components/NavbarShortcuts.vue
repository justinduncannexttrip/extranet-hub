<script setup>
import {useStorage} from "@vueuse/core";

let  shortcuts = localStorage.getItem('userShortcuts') || '[]';
try {
  shortcuts = JSON.parse(shortcuts);
} catch (e) {
  shortcuts = [];
}

</script>

<template>
  <Shortcuts :shortcuts="shortcuts" />
</template>
