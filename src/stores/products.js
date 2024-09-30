// Este store en Pinia gestiona la funcionalidad de productos de una tienda virtual. 
// Utiliza Firebase Firestore para almacenar los productos y Firebase Storage para manejar las imágenes asociadas. 
// Implementa las operaciones básicas de CRUD (Crear, Leer, Actualizar, Borrar) sobre los productos.

import { computed, ref } from "vue"; 
import { defineStore } from "pinia"; 
import { useFirestore, useCollection, useFirebaseStorage } from "vuefire"; 
import { collection, addDoc, query, orderBy, updateDoc, doc, getDoc, deleteDoc } from "firebase/firestore";
import { ref as storageRef, deleteObject } from "firebase/storage";

//! Definición del store 'products'
export const useProductsStore = defineStore('products', () => {

  //! Conexión a Firestore y Firebase Storage
  const db = useFirestore() // Conecta Firestore para manejar la base de datos
  const storage = useFirebaseStorage() // Conecta Firebase Storage para manejar las imágenes

  //! Categorías de productos y categoría seleccionada
  const selectedCategory = ref(1) // Almacena la categoría seleccionada para filtrado
  const categories = [
    { id: 1, name: 'Sudaderas' },
    { id: 2, name: 'Zapatillas' },
    { id: 3, name: 'Gafas' }
  ]

  //! LEER (Read) - Consulta productos en Firestore y los mantiene sincronizados en tiempo real
  const q = query(
    collection(db, 'products'), // Apunta a la colección 'products' en Firestore
    orderBy('availability', 'asc') // Ordena los productos por disponibilidad en orden ascendente
  )
  const productsCollection = useCollection(q) // Sincroniza los productos en tiempo real

  //! CREAR (Create) - Función para agregar un nuevo producto
  async function createProduct(product) {
    await addDoc(collection(db, 'products'), product); // Añade un nuevo producto a la colección 'products' en Firestore
  }

  //! ACTUALIZAR (Update) - Función para modificar un producto existente
  async function updateProduct(docRef, product) {
    const { image, url, ...values } = product // Desestructura el producto separando la imagen de los demás valores

    if (image.length) {
      // Si hay una nueva imagen, actualiza el campo 'image' con la URL de Firebase Storage
      await updateDoc(docRef, {
        ...values,
        image: url.value
      })
    } else {
      // Si no se cambia la imagen, actualiza los demás valores del producto
      await updateDoc(docRef, values)
    }
  }

  //! BORRAR (Delete) - Función para eliminar un producto y su imagen de Firebase Storage
  async function deleteProduct(id) {
    if (confirm('¿Eliminar Producto?')) {
      const docRef = doc(db, 'products', id) // Referencia al documento del producto en Firestore
      const docSnap = await getDoc(docRef) // Obtiene los datos del producto
      const { image } = docSnap.data() // Extrae la URL de la imagen
      const imageRef = storageRef(storage, image) // Referencia a la imagen en Firebase Storage

      await Promise.all([
        deleteDoc(docRef), // Elimina el documento del producto de Firestore
        deleteObject(imageRef) // Elimina la imagen asociada de Firebase Storage
      ])
    }
  }

  //! Computed property para las opciones del selector de categorías
  const categoryOptions = computed(() => {
    const options = [
      { label: 'Seleccione', value: '', attrs: { disabled: true } }, // Opción por defecto
      ...categories.map(category => (
        { label: category.name, value: category.id } // Mapea las categorías a opciones del select
      ))
    ]
    return options;
  })

  //! Computed property para verificar si no hay productos disponibles
  const noResults = computed(() => productsCollection.value.length === 0) // Retorna true si no hay productos

  //! Computed property para filtrar productos según la categoría seleccionada
  const filteredProducts = computed(() => {
    // Filtra los productos por la categoría seleccionada
    return productsCollection.value
      .filter(product => product.category === selectedCategory.value)
      .filter(product => product.availability > 0 )
  }) 

  return {
    createProduct, 
    updateProduct,
    deleteProduct,
    productsCollection,
    categories,
    selectedCategory,
    categoryOptions, 
    noResults,
    filteredProducts
  }

})
