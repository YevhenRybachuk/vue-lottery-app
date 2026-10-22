<script setup lang="ts">
</script>

<template>
  <section class="about">
    <h1>Про автора</h1>
    <p>Рибачук Євген Юрійович</p>

    <h2>Технічні навички</h2>
    <ul>
      <li>HTML та CSS/SCSS</li>
      <li>JavaScript та TypeScript</li>
      <li>Vue 3 і Composition API</li>
      <li>Git та GitHub</li>
    </ul>

    <p>
      GitHub:
      <a
          href="https://github.com/YevhenRybachuk"
          target="_blank"
          rel="noopener noreferrer"
      >
        YevhenRybachuk
      </a>
    </p>
  </section>
</template>

<style scoped lang="scss">
.about {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 20px;

  h2 {
    margin-top: 24px;
  }

  li {
    margin-bottom: 8px;
  }
}
</style>
