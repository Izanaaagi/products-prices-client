<template id='app'>
  <q-layout view='hHr lpR ffr'>
    <q-header class='bg-blue-grey-7 text-white'>
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <q-icon name='sell'></q-icon>
          </q-avatar>
          Products Prices
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container class='column'>
      <div class='row q-my-xl'>
        <h2 class='col-sm-12 text-h2 text-center title'>
          {{ searchTitle }}
          <q-icon name='south'></q-icon>
        </h2>
      </div>
      <div class='row justify-evenly'>
        <q-select
          @update:model-value='onSupermarketChange'
          class='col-sm-2 col-12'
          outlined v-model='supermarket'
          :options='supermarkets'
          label='Supermarket'
          behavior='menu'
          option-label='title' />
        <search ref='search' @selectProduct='onSelectProduct' class='col-12 col-sm-9 q-mb-lg q-ma-md-lg search'
                :supermarket-id='supermarket?.id'></search>
      </div>
      <div class='row justify-around'
           style='margin-top: auto; margin-bottom: auto; max-height: 50vh'>
        <div class='col-12 col-sm-8'>
          <q-toolbar class='bg-blue-grey-7  text-white shadow-2'>
            <q-toolbar-title>Selected Products</q-toolbar-title>
          </q-toolbar>
          <q-list bordered separator style='max-height: 45vh; overflow: auto; overflow-x: hidden'>
            <div v-if='selectedProducts.length > 0'>
              <q-item v-for='product in selectedProducts' v-bind:key='product.id'>
                <q-item-section avatar class='column justify-center items-center'>
                  <q-btn
                    icon='cancel'
                    round
                    size='sm'
                    dense
                    @click='removeSelectedProduct(product)' />
                  <div class='row justify-center items-center'>
                    <q-btn size='xs' padding='xs' color='orange' @click='minusProduct(product)'>-</q-btn>
                    <q-item-label caption class='text-center q-mt-sm q-mx-xs'>x{{ product.count }}</q-item-label>
                    <q-btn size='xs' padding='xs' color='green' @click='addProduct(product)'>+</q-btn>
                  </div>
                </q-item-section>
                <q-item-section>
                  <q-item-label class='text-uppercase text-weight-bolder'>{{ product.store_title }}</q-item-label>
                  <q-item-label>{{ product.title }}</q-item-label>
                  <q-item-label caption>{{ product.weight }}</q-item-label>
                </q-item-section>
                <q-item-section top>
                </q-item-section>
                <q-item-section side top>
                  <div v-if='product.discount_price'>
                    <q-item-label>{{ product.discount_price / 100 }} грн</q-item-label>
                    <q-item-label><s>{{ product.price / 100 }} грн</s></q-item-label>
                  </div>
                  <q-item-label v-else>{{ product.price / 100 }} грн</q-item-label>
                </q-item-section>
                <q-separator />
              </q-item>
            </div>
            <div v-else>
              <q-item class='text-center'>
                <q-item-section>
                  <q-item-label caption>No products</q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </q-list>
        </div>
        <q-card bordered class='col-12 col-sm-2 bg-blue-grey-2' style='max-height: 185px'>
          <q-card-section>
            <div class='text-h6'>Total</div>
            <div class='text-subtitle2'>{{ totalProducts }} products</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div class='text-h6 text-bold'>{{ totalPrice }} грн</div>
          </q-card-section>
        </q-card>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue';
import axiosInstance from '@/api';
import type { Supermarket } from '@/interfaces/supermarket';
import type { Product } from '@/interfaces/products';
import Search from '@/components/Search.vue';

const supermarket = ref<Supermarket>();
const supermarkets = ref<Array<Supermarket>>();

const onSupermarketChange = () => {
  search.value!.searchQuery = '';
  search.value!.products = [];
};

const searchTitle = computed(
  () => supermarket.value
    ? `Search Products in ${supermarket.value?.title}`
    : `Select Supermarket`);

const selectedProducts = ref<Array<Product>>([]);

const onSelectProduct = (val: Product) => {
  const product: Product = { ...val, count: 1 };
  const productIndex = selectedProducts.value.findIndex((element) => element.id === product.id);

  productIndex === -1
    ? selectedProducts.value.push(product)
    : selectedProducts.value[productIndex].count = selectedProducts.value[productIndex].count + 1;
};

const removeSelectedProduct = (product: Product): void => {
  const productIndex = selectedProducts.value.findIndex((element) => element.id === product.id);
  selectedProducts.value.splice(productIndex, 1);
};

const addProduct = (product: Product): void => {
  const productIndex = selectedProducts.value.findIndex((element) => element.id === product.id);
  selectedProducts.value[productIndex].count = selectedProducts.value[productIndex].count + 1;
};

const minusProduct = (product: Product): void => {
  const productIndex = selectedProducts.value.findIndex((element) => element.id === product.id);
  const productCount = selectedProducts.value[productIndex].count;
  productCount === 1
    ? removeSelectedProduct(product)
    : selectedProducts.value[productIndex].count = productCount - 1;
};

const totalProducts = computed(() => selectedProducts.value.reduce((acc, product) => acc + product.count, 0));

const totalPrice = computed(
  () => (selectedProducts.value.reduce(
    (acc, product) => product.discount_price
      ? acc + product.discount_price * product.count
      : acc + product.price * product.count, 0) / 100)
);

const search = ref<InstanceType<typeof Search> | null>(null);

onMounted(async () => {
  const { data } = await axiosInstance.get('/supermarkets');
  supermarkets.value = data;
});
</script>

<style lang='scss'>
@import './assets/base.css';

@media (max-width: $breakpoint-xs-max) {
  .search {
    margin-top: 15px;
  }
}

</style>
