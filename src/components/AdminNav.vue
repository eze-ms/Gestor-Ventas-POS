<script setup>
    import { RouterLink } from 'vue-router';
    import Link from './Link.vue';
    import Logo from './Logo.vue';
</script>


<template>
    <header class="px-10 py-5 bg-gray-700 flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between absolute top-0 w-full z-10 h-24">
        <div>
            <Logo />
        </div>
       

        <nav>
            <RouterLink
                :to="{name: 'products'}"
                class="rounded text-white font-bold p-2"
            >
                Productos
            </RouterLink>

            <RouterLink
                :to="{name: 'sales'}"
                class="rounded text-white font-bold p-2"
            >
                Ventas
            </RouterLink>

           <Link
                to="shop"
                
           >
                <span class="text-white font-medium drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)]">
                    Ir a tienda
                </span>
            </Link>
        </nav>
    </header>
</template>

