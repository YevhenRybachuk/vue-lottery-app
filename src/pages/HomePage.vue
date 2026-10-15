<script setup lang="ts">
</script>

<template>
  <section class="home">
    <h1>Vue Lottery App</h1>
    <p>
      Вебзастосунок для реєстрації учасників лотереї,
      перегляду списку учасників і визначення переможця.
    </p>

    <h2>Використані технології</h2>
    <ul>
      <li>Vue 3</li>
      <li>TypeScript</li>
      <li>Vite</li>
      <li>SCSS</li>
      <li>Vue Router</li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.home {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 20px;

  h1 {
    margin-bottom: 16px;
  }

  p {
    margin-bottom: 24px;
    line-height: 1.6;
  }
}
</style>
