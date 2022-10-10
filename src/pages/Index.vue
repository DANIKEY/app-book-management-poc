<template>
  <q-page>
    <book-component></book-component>
  </q-page>
</template>

<script lang="ts">
import BookComponent from 'components/BookComponent.vue';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'PageIndex',
  components: { BookComponent },
  setup() {}
});
</script>
