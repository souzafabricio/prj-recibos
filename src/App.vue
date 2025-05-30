<template>
  <div id="app">
    <header>
      <img src="@/assets/logojoaog.png" alt="Logo" class="logo" />
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  background-color: #2c3e50;
  color: #dadcde;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow: hidden;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  /* background-color: #1f2a35; */
  text-align: center;
  height: 17vh;
}

.logo {
  height: 260px;
  margin-top: -70px;
}

main {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
