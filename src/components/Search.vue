<template>
  <div class='column' v-click-outside='onClickOutside'>
    <q-input
      :disable='!supermarketId'
      @focus='()=> isFocus = true'
      v-model='searchQuery'
      @update:model-value='searchProduct(supermarketId)'
      outlined
      label='Product'>
      <template v-slot:append>
        <q-icon name='search'></q-icon>
      </template>
    </q-input>
    <q-list
      v-if='products.length > 0'
      v-show='isFocus'
      bordered separator
      class='bg-white relative-position absolute z-top full-width no-blur'
      style='max-height: 50vh; overflow: auto; overflow-x: hidden; top: 55px'>
      <q-virtual-scroll :items='products' separator>
        <template v-slot='{ item, index }'>
          <q-item
            v-bind:key='index'
            clickable
            @click='$emit("selectProduct", item)'>
            <q-item-section>
              <q-item-label>{{ item.title }}</q-item-label>
              <q-item-label caption>{{ item.weight }}</q-item-label>
            </q-item-section>
            <q-item-section side top>
              <div v-if='item.discount_price'>
                <q-item-label>{{ item.discount_price / 100 }} грн</q-item-label>
                <q-item-label><s>{{ item.price / 100 }} грн</s></q-item-label>
              </div>
              <q-item-label v-else>{{ item.price / 100 }} грн</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-virtual-scroll>
    </q-list>
  </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import type { Product } from '@/interfaces/products';
import axiosInstance from '@/api';

const props = defineProps<{
  supermarketId: number | undefined
}>();

const isFocus = ref<boolean>(false);

const onClickOutside = () => {
  isFocus.value = false;
};

const products = ref<Array<Product>>([]);
const searchQuery = ref<string>('');

const searchProduct = async (supermarketId: number | undefined) => {
  if (searchQuery.value && supermarketId) {
    const { data } = await axiosInstance.get(
      `/products/search/${supermarketId}/${searchQuery.value}?size=99999999999999`
    );
    products.value = data;
  } else {
    products.value = [];
  }
};

defineExpose({
  searchQuery,
  products
});

</script>