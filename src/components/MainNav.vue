<script setup>
    import { useProductsStore } from '@/stores/products';
    import Link from './Link.vue';
    import Logo from './Logo.vue';

    const products = useProductsStore()
</script>


<template>
    <header class="px-5 py-5 bg-gray-700 flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between absolute top-0 w-full z-10">
        <div>
            <Logo />

            <div class="flex gap-3 text-white">
                <div
                    class="flex items-center gap-2"
                    v-for="category in products.categories"
                    :key="category.id"
                >
                    <input 
                        type="radio"
                        name="category"
                        :value="category.id"
                        class="h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                        :checked="products.selectedCategory === category.id"
                        @change="products.selectedCategory = +$event.target.value"
                    >
                    <label class="text-gray-100">{{ category.name }}</label>
                </div>
            </div>
        </div>
       
        <nav>
            <Link 
                to="sales" 
            >
                <span class="text-white font-medium drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)]">
                    Administrar
                </span>
            </Link>
        </nav>
    </header>
</template>

