import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { query, collection, where } from 'firebase/firestore';
import { useFirestore, useCollection } from 'vuefire';

export const useSalesStore = defineStore('sales', () => {
  const db = useFirestore()
  const date = ref('')

  const salesSource = computed(() => {
    if(date.value) {
      const  q = query(
        collection(db, 'sales'),
        where('date', '==', date.value)
      )
      return q
    }
  })

  const  salesCollection = useCollection(salesSource)

  const selectedDate = ref(new Date())
  const formatter = ref({
    date: 'DD/MM/YYYY',
    month: 'MMMM'
  })

  const isDateSelected = computed(() => date.value)

  const noSales = computed(() => !salesCollection.length && date.value )

  const  totalSalesOfDateDay = computed(() => {
    return salesCollection.value ? salesCollection.value.reduce((total, sale) => total + sale.total, 0) : 0
  })

  return {
    date,
    salesCollection,
    selectedDate,
    formatter,
    isDateSelected,
    noSales,
    totalSalesOfDateDay
  }
})
