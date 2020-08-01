<template>
  <div class="list">
    <div
      v-for="(item, index) in items"
      :key="item.toString()"
      class="row"
      @click="$emit('select-row', index)"
    >
      <slot :item="item" :index="index">{{item.toString()}}</slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "List",
  props: {
    items: Array,
  },
};
</script>

<style scoped>
.list {
  overflow: auto;
  max-height: inherit;
}

.row {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 0.15em;
}

.row:hover {
  background: #eaeaea;
}
</style>