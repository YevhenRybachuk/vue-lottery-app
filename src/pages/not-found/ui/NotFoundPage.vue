<template>
  <section class="not-found">
    <h1>404</h1>
    <p>На жаль, такої сторінки не існує.</p>
    <RouterLink to="/">Повернутися на головну</RouterLink>
  </section>
</template>

<style scoped lang="scss">
.not-found {
  padding: 64px 20px;
  text-align: center;

  h1 {
    font-size: 64px;
    margin-bottom: 16px;
  }
}
</style>
