<script setup>
    import { useCuponStore } from '@/stores/cupons';

    const store = useCuponStore()
</script>

<template>
    <p class="mt-5 py-5 font-normal text-center border-t border-gray-200">
        ¿Tienes un cupón de descuento? ¡Aprovecha y canjéalo aquí!
    </p> 

    <div class="flex">
        <input 
            type="text"
            placeholder="Introduce tu cupón"
            class="p-2 bg-white border-gray-300 w-full focus:outline-none focus:border-gray-300 focus:ring-0"
            v-model="store.cuponInput"
        />
        <button
            type="button"
            class="p-3 bg-green-500 font-medium text-white rounded hover:bg-green-600 disabled:opacity-50"
            @click="store.applyCupon"
            :disabled="store.isValidCupon"
        >
            Aplicar
        </button>
    </div>

    <p :class="`${store.messageColor} font-bold text-center py-2 text-sm`">
        {{ store.cuponValidationMessage }}
    </p>


</template>
