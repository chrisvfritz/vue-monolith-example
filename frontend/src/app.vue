<template>
  <div id="app">
    <nav>
      <ul>
        <li>
          <router-link :to="{ name: 'home' }">
            Home
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'about' }">
            About
          </router-link>
        </li>
      </ul>
    </nav>
    <main>
      <router-view/>
    </main>
  </div>
</template>
