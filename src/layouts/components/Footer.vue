<template>
  <div class="h-100 d-flex align-center justify-space-between text-medium-emphasis">
    <!-- 👉 Footer: left content -->
    <span class="d-flex align-center">
      &copy;
      {{ new Date().getFullYear() }}
      By <a
      href="https://nexttrip.com"
      target="_blank"
      rel="noopener noreferrer"
      class="text-primary ms-1"
    >NextTrip.com</a>
    </span>
    <!-- 👉 Footer: right content -->
    <span class="d-md-flex gap-x-4 text-primary d-none">
      <a
        href="https://nexttrip.com/about-us/"
        target="_blank"
      >About</a>
      <a
        href="https://nexttrip.com/careers/"
        target="_blank"
      >Careers</a>
      <a
        href="https://nexttrip.com/contact-2/"
        target="_blank"
      >Contact Us</a>
    </span>
  </div>
</template>
<script setup>
</script>
