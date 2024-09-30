import { ref, watch, computed } from "vue";
import { defineStore } from "pinia";
import { useCartStore } from "./cart";

export const useCuponStore = defineStore('cupon', () => {

  const cart = useCartStore()
  const cuponInput = ref('')
  const cuponValidationMessage = ref('')
  const messageColor = ref('')
  const discountPercentage = ref(0)
  const discount = ref(0)

  const VALID_CUPONS = [
    {name: '10DESCUENTO', discount: .10 },
    {name: '20DESCUENTO', discount: .20 }
  ]

  watch(discountPercentage, () => {
    discount.value = (cart.total * discountPercentage.value).toFixed(2)
  })

  // Función para aplicar el cupón
  function applyCupon() {
    const foundCupon = VALID_CUPONS.find(cupon => cupon.name === cuponInput.value)

    if (foundCupon) {
      cuponValidationMessage.value = 'Aplicando...'
      messageColor.value = 'text-green-500'

      setTimeout(() => {
        discountPercentage.value = foundCupon.discount
        cuponValidationMessage.value = '¡Descuento aplicado!'

      }, 3000);

    } else {
      cuponValidationMessage.value = 'Lo sentimos, ese cupón no es válido. Inténtalo de nuevo.'
      messageColor.value = 'text-red-500'

      setTimeout(() => {
        cuponValidationMessage.value = ''
        messageColor.value = ''
      }, 6000)
    }
  }

  const isValidCupon = computed(() => discountPercentage.value > 0 )
  
  return {
    cuponInput,
    discount,
    applyCupon,
    cuponValidationMessage,
    messageColor,
    discountPercentage,
    isValidCupon
  }
})
