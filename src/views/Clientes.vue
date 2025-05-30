<template>
  <div class="container mt-3 ">
    <h1 class="text-center mb-4">Clientes</h1>

    <div class="mb-3 d-flex justify-content-center">
      <input
        type="text"
        v-model="filtro"
        placeholder="Buscar cliente pelo nome..."
        class="form-control w-100"
        style="max-width: 500px"
      />
    </div>

    <div class="clientes-container mx-auto mb-4 shadow rounded p-3">
      <div v-if="clientesFiltrados.length">
        <div
          v-for="cliente in clientesFiltrados"
          :key="cliente.id"
          @click="editarCliente(cliente.id)"
          class="cliente-nome px-3 py-2 mb-2 rounded"
        >
          {{ cliente.nome }}
        </div>
      </div>
      <div v-else class="text-center text-muted mt-5">
        Nenhum cliente encontrado.
      </div>
    </div>

    <div class="d-flex justify-content-center gap-3">
      <router-link to="/" class="btn btn-secondary">
        Voltar
      </router-link>
      <router-link to="/CadastroCliente" class="btn btn-success">
        Cadastrar Cliente
      </router-link>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "vue-router";

export default {
  name: "ClientesView",
  setup() {
    const clientes = ref([]);
    const filtro = ref("");
    const router = useRouter();

    const buscarClientes = async () => {
      const querySnapshot = await getDocs(collection(db, "clientes"));
      clientes.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    };

    const clientesFiltrados = computed(() => {
      return clientes.value.filter(cliente =>
        cliente.nome.toLowerCase().includes(filtro.value.toLowerCase())
      );
    });

    const voltar = () => {
      router.back();
    };

    const editarCliente = (id) => {
      router.push(`/editarCliente/${id}`);
    };

    onMounted(() => {
      buscarClientes();
      ocultarFooter();
    });

    const ocultarFooter = () => {
      const footer = document.querySelector("footer");
      if (footer) {
        footer.style.display = "none";
      }
    };

    return { clientes, filtro, clientesFiltrados, voltar, editarCliente };
  }
};
</script>

<style scoped>
.container {
  margin-bottom: 200px;
}

.mb-4 {
  margin-bottom: 12px !important;
}

.clientes-container {
  height: 350px;
  overflow-y: auto;
  width: 100%;
  margin-top: 5px;
  max-width: 500px;
  background-color: #ffffff;
}

.cliente-nome {
  background-color: #f8f9fa;
  cursor: pointer;
  font-size: 0.95rem;
  color: #000000;
  transition: background-color 0.2s ease;
}

.cliente-nome:hover {
  background-color: #e2e6ea;
}

.btn-success {
  background-color: #42b983;
}

.btn-success:hover {
  background-color: #369b6e;
}

.btn-secondary {
  background-color: #888;
}

.btn-secondary:hover {
  background-color: #666;
}
</style>
