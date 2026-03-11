<script setup lang="ts">
// Simple Card component demonstrating default slot
// You can pass any content between <Card></Card> tags
</script>

<template>
  <div class="card-container">
    <!-- Default slot: accepts any content passed between the component tags -->
    <slot>
      <!-- Fallback content if no slot content is provided -->
      <p class="fallback-text">No content provided</p>
    </slot>
  </div>
</template>

<style scoped>
.card-container {
  padding: 1.5rem;
  border-radius: 14px;
  background: var(--input-bg);
  border: 1px solid var(--border-color);
  transition: transform 0.2s, box-shadow 0.2s;
}

.card-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.fallback-text {
  color: var(--text-muted);
  font-style: italic;
  margin: 0;
}
</style>
