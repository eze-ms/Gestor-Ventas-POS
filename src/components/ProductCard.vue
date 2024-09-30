<script setup>
    import { useCartStore } from '@/stores/cart';
    import { formatCurrency } from '@/helpers';

    const cart = useCartStore()

    defineProps({
        product: {
            type: Object
        }
    })
</script>

<template>
    <div
        class="rounded bg-white shadow relative overflow-hidden"
    >
        <img 
            :src="product.image" 
            :alt="'imagen de ' + product.name"
            class="transition-transform duration-300 ease-in-out hover:scale-110"
        >

        <div class="p-3 space-y-2 flex flex-col">
            <h3 class="text-lg leading-none font-medium text-gray-600 min-h-[40px]">{{ product.name }}</h3>
            <p class="text-sm text-gray-500 min-h-[20px]">Disponibles: {{ product.availability }}</p>
            <p class="text-md font-medium text-gray-800">{{ formatCurrency(product.price) }}</p>
        </div>

        <button
            type="button"
            class="absolute top-1 right-1"
            @click="cart.addItem(product)"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 bg-gray-300 rounded-full text-white transform transition-transform duration-200 ease-in-out hover:scale-110">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </button>

    </div>
</template>