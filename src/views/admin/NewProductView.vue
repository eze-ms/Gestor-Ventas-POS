<script setup>
    import { reactive } from 'vue';
    import { useRouter } from 'vue-router';
    import Link from '@/components/Link.vue';
    import useImage from '@/composables/useImage';     
    import { useProductsStore } from '@/stores/products';

    const { url ,onFileChange, isImageUploaded } = useImage()
    const products = useProductsStore()
    const router = useRouter()

    const formData = reactive({
        name: '',
        category: '',
        price: '',
        availability: '',
        image: ''

    })

    const submitHandler = async data => {
        const { image, ...values } = data // Extraemos los elementos que no queramos mostrar
        
        try {
            await products.createProduct({
                ...values,
                image: url.value
            })
            router.push({name: 'products'})
        } catch (error) {
            console.log(error)
        }
    }
</script>

<template>
    <div>
        <Link to="products">Volver</Link>

        <h1 class="text-4xl font-bold my-10">Nuevo Producto</h1>

        <div class="flex justify-center bg-white shadow">
            <div class="mt-10 p-10 w-full 2xl:w-2/4">
                <FormKit
                    type="form"
                    submit-label="Agregar Producto"
                    form-class="flex flex-col items-center"
                    incomplete-message = "Producto sin subir, revisa los mensajes"
                    @submit = "submitHandler"
                    :value="formData"
                >
                    <!-- Nombre del Producto -->
                    <FormKit
                        type="text"
                        label="Nombre"
                        name="name"
                        placeholder="Nombre de Producto"
                        validation="required"
                        :validation-messages="{ required: 'El nombre del producto es obligatorio' }"
                        outer-class="w-1/2 mx-auto"
                        v-model.trim="formData.name"
                    />

                    <!-- Imagen del Producto -->
                    <FormKit
                        type="file"
                        label="Imagen Producto"
                        name="image"
                        validation="required"
                        :validation-messages="{ required: 'La imagen del producto es obligatoria' }"
                        accept=".jpg, .png, .webp"
                        outer-class="w-1/2 mx-auto" 
                        @change="onFileChange"
                        v-model.trim="formData.image"
                    >
                        <template #noFiles>
                            <span></span>
                        </template>
                    </FormKit>
                    
                    <div v-if="isImageUploaded">
                        <p class="font-medium">Imagen del Producto:</p>
                        <img 
                            :src="url" 
                            alt="imagen del producto"
                            class="w-32"
                        >
                    </div>

                    <!-- Categoría -->
                    <FormKit
                        type="select"
                        label="Categoría"
                        name="category"
                        validation="required"
                        :validation-messages="{required: 'La categoría del producto es obligatoria'}"
                        :options="products.categoryOptions"
                        outer-class="w-1/2 mx-auto"
                        v-model.number="formData.category"
                    />

                    <!-- Precio -->
                    <FormKit
                        type="number"
                        label="Precio"
                        name="price"
                        placeholder="Precio de Producto"
                        validation="required"
                        :validation-messages="{required: 'El precio es obligatorio'}"
                        min="1"
                        outer-class="w-1/2 mx-auto"
                        v-model.number="formData.price"
                    />

                    <!-- Disponibles -->
                    <FormKit
                        type="number"
                        label="Disponibles"
                        name="availability"
                        placeholder="Cantidad disponible"
                        validation="required"
                        :validation-messages="{required: 'La cantidad es obligatoria'}"
                        min="1"
                        outer-class="w-1/2 mx-auto"
                        v-model.number="formData.availability"
                    />
                </FormKit>
            </div>
        </div>
    </div>
</template>
