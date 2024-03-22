<script setup lang="js">
import Calendar from '@/pages/apps/calendar.vue';

definePage({
  to: { name: 'home'},
  name: 'home',
  path: '/',
  meta: {
    action: 'read',
    subject: 'userPage',
  }
});

</script>
<template>
  <div>
    <VCard
      class="mb-6"
      title="Welcome to Nexttrip's Nextranet 👋🏻"
    >
      <VCardText>
        Please visit our <a
          href="/dashboards/academy"
          target="_blank"
          rel="noopener noreferrer"
          class="text-decoration-none"
        >
          Academy Page
        </a> to understand where to go from here and how to use our Application.
      </VCardText>
    </VCard>

    <Calendar />
  </div>
</template>
