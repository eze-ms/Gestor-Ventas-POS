<script setup>
    import ShoppingCartItem from './ShoppingCartItem.vue';
    import Amount from './Amount.vue';
    import CuponForm from './CuponForm.vue';
    import { useCartStore } from '@/stores/cart';
    import { useCuponStore } from '@/stores/cupons';
    import { formatCurrency } from '@/helpers';

    const cart = useCartStore()
    const cupon = useCuponStore()
</script>

<template>
    <div>
        <p v-if="cart.isEmpty" class="text-md text-center text-gray-800">El carrito está vacío</p>

        <div v-else>
            <p class="text-xl text-center font-bold text-gray-800">Resumen de venta</p>
            <ul
                role="list"
                class="mt-6 divide-y divide-gray-200"
            >
                <ShoppingCartItem 
                    v-for="item in cart.items"
                    :key="item.id"
                    :item="item"
                />
            </ul>

            <dl class="space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-gray-500">
                <Amount>
                    <template #label>
                        <span class="text-md font-medium text-gray-900">Subtotal:</span>
                    </template>
                    {{ formatCurrency(cart.subtotal) }}
                </Amount>

                <Amount>
                    <template #label>
                        <span class="text-md font-medium text-gray-900">Iva (21%):</span>
                    </template>
                    {{ formatCurrency(cart.taxes) }}
                </Amount>

                <Amount v-if="cupon.isValidCupon">
                    <template #label>
                        <span class="text-md font-medium text-gray-900">Descuento:</span>
                    </template>
                    {{ formatCurrency(cupon.discount) }}
                </Amount>

                <Amount>
                    <template #label>
                        <span class="text-xl font-medium text-gray-900">Total a pagar:</span>
                    </template>
                    <span class="text-lg font-bold text-gray-900">{{ formatCurrency(cart.total) }}</span>
                </Amount>
            </dl>
            
            <CuponForm />

            <button
                type="button"
                class="mt-10 w-full bg-green-500 text-white rounded hover:bg-green-600 font-bold p-3"
                @click="cart.checkout"
            >Confirmar Compra
            </button>
        </div>
    </div>
</template>