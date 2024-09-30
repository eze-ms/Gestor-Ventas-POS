// Este store gestiona la funcionalidad del carrito de compras.
// Permite agregar productos, modificar sus cantidades, 
// calcular el subtotal y los impuestos, verificar si el carrito está vacío y limitar la cantidad máxima de productos.

import { ref, computed, watchEffect } from "vue"; 
import { defineStore } from "pinia";
import { collection, addDoc, runTransaction, doc } from "firebase/firestore";
import { useFirestore } from "vuefire";
import { useCuponStore } from "./cupons";
import { getCurrentDate } from "@/helpers";


export const useCartStore = defineStore('cart', () => {

  //** Constantes para límites de productos e impuestos
  const MAX_PRODUCTS = 5  // Máximo permitido de productos
  const TAX_RATE = 0.21   // Tasa de impuestos


  //** Contantes
  const cupon = useCuponStore()
  const db = useFirestore()
  
  //** Estado del carrito
  const items = ref([]) // Lista de productos en el carrito
  const subtotal = ref(0) // Subtotal de los productos
  const taxes = ref(0)  // Impuestos calculados sobre el subtotal
  const total = ref(0)  // Total calculado sobre el subtotal e impuestos
  

  //** Cálculo del subtotal, los impuestos y el total cuando cambian los productos
  watchEffect(() => {
    subtotal.value = items.value.reduce((total, item) => total + (item.quantity * item.price), 0) // la cantidad de cada producto por su precio. La suma total se asigna a `subtotal.value`.
    taxes.value = Number ((subtotal.value * TAX_RATE).toFixed(2))  // El valor del subtotal multiplicado por TAX_RATE es el que se le asigna a taxes.value
    total.value = Number (((subtotal.value + taxes.value) - cupon.discount).toFixed(2))  // El total es la suma del subtotal más los impuestos - el descuento del cupón
  })


  //** Función para agregar productos al carrito 
  function addItem(item) {
    // Buscar el índice del producto en el carrito
    const index = isEmptyInCart(item.id)

    // Si el producto ya está en el carrito
    if (index >= 0) {
        // Verifica si la cantidad actual ya es mayor o igual a la disponibilidad
        if (isProductAvailable(item, index)) 
            alert('Has alcanzado el límite de cantidades')

        // Incrementa la cantidad del producto
        items.value[index].quantity++
    } else {
        // Si el producto no está en el carrito, lo agrega con una cantidad inicial de 1
        items.value.push({ ...item, quantity: 1, id: item.id })
    }
  }


  //** Función para actualizar la cantidad de un producto
  function updateQuantity(id, quantity) {
    items.value = items.value.map(item => 
      item.id === id ? { ...item, quantity } : item 
    )
    // Actualiza la cantidad de un producto en el carrito por su ID
  }


  //** Función para borrar productos del carrito
  function removeItem(id) {
    items.value = items.value.filter(item => item.id !== id) // trae los que son distintos a el id que le estamos pasando
  }  


  //** Función para almacenar las ventas
  async function checkout() {
    try {
      await addDoc(collection(db, 'sales'), {
        items: items.value.map(item => {
          const { availability, category, ...data } = item // Sacamos datos no necesarios como son availability y category
          return data
        }),
        subtotal: subtotal.value,
        taxes: taxes.value,
        discount: cupon.discount,
        total: total.value,
        date: getCurrentDate()
      })

      //* Iterar sobre cada item en items.value para procesar su disponibilidad
      items.value.forEach(async (item) => {
        const productRef = doc(db, 'products', item.id) // Crear una referencia al documento del producto en Firestore usando el ID del item

        // Ejecutar una transacción en Firestore para asegurar que las operaciones sean atómicas
        await runTransaction(db, async (transaction) => {
            const currentProduct = await transaction.get(productRef) // Obtener el producto actual dentro de la transacción
            const availability = currentProduct.data().availability - item.quantity // Calcular la nueva disponibilidad, restando la cantidad que el usuario quiere comprar

            // Actualizar el valor de la disponibilidad en Firestore dentro de la transacción
            transaction.update(productRef, { availability })
        })
      })


      // Reiniciar el state
      $reset() // LLamamos a la función reset

    } catch (error) {
        console.log(error)
    }
  }

  //* Función para resetear el state
  function $reset() {
    items.value = []
    subtotal.value = 0
    taxes.value = 0
    total.value = 0
  }


  //** Función para verificar si un producto ya está en el carrito
  const isEmptyInCart = id => items.value.findIndex(item => item.id === id) // Retorna el índice del producto en el carrito si existe, o -1 si no lo encuentra



  //** Computed property que comprueba si el carrito está vacío
  const isEmpty = computed(() => items.value.length === 0)



   //** Función para verificar si la cantidad de un producto en el carrito excede o es igual a su disponibilidad
  const isProductAvailable = (item, index) => {
    return items.value[index].quantity >= item.availability || items.value[index].quantity >= MAX_PRODUCTS
  }


  //** Computed property para verificar la disponibilidad de productos y limitar la cantidad máxima
  const checkProductAvailability = computed(() => {
    return (product) => product.availability < MAX_PRODUCTS 
      ? product.availability 
      : MAX_PRODUCTS
    // Limita la cantidad de un producto según su disponibilidad o el máximo permitido
  })


  return {
    items, 
    subtotal,
    taxes,
    total,
    addItem, 
    updateQuantity,
    removeItem,
    checkout,
    isEmpty, 
    checkProductAvailability
  }
})
