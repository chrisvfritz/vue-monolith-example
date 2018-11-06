<script>
export default {
  props: {
    todos: {
      type: Array,
      required: true,
    },
  },
}
</script>

<template>
  <div>
    <h1>Home</h1>
    <h2>Todos</h2>
    <ul>
      <li
        v-for="todo in todos"
        :key="todo.id"
      >
        {{ todo.text }}
      </li>
    </ul>
  </div>
</template>
