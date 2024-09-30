<script setup>
    import VueTailwindDatepicker from 'vue-tailwind-datepicker'
    import { useSalesStore } from '@/stores/sales';
    import SalesDetail from '@/components/SalesDetail.vue';
    import { formatCurrency } from '@/helpers';
    
    const sales = useSalesStore()
    
</script>

<template>
    <h1 class="text-3xl font-bold my-10 text-center lg:text-left">Resumen de Ventas</h1>
    
    <div class="md:flex md:items-start gap-5">

        <div class="md:w-1/2 lg:w-1/3 bg-white flex justify-center p-5">
            <VueTailwindDatepicker 
                v-model="sales.date"          
                i18n="es-es"                 
                as-single
                no-input
                @update:modelValue="sales.selectedDate = $event" 
                :formatter="sales.formatter"  
            />
        </div>

        <div class="md:w-1/2 lg:w-2/3 space-y-5 lg:h-screen lg:overflow-y-scroll p-5 pb-32">
            <p 
                class="text-center text-lg"
                v-if="sales.isDateSelected"
                >
                Ventas del día: <span class="font-bold">{{ sales.date }}</span>
            </p>

            <p v-else class="text-center text-lg">Selecciona una fecha</p>

            <div v-if="sales.salesCollection.length" class="space-y-5">
                <p class="text-right text-2xl">Total ventas del día:
                    <span class="font-black">
                        {{ formatCurrency(sales.totalSalesOfDateDay) }}
                    </span>
                </p>
                <SalesDetail 
                    v-for="sale in sales.salesCollection"
                    :key="sale.id"
                    :sale="sale"
                />
                
            </div>
            <p v-else-if="sales.noSales" class="text-lg text-center font-bold">
                No hay ventas en este día
            </p>
        </div> 
    </div>
</template>
