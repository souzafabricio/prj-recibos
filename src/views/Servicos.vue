<template>
  <div class="container mt-1">
    <h1 class="text-center mb-4">Serviços</h1>

    <div class="mb-3 d-flex justify-content-center">
      <input
        type="text"
        v-model="filtro"
        placeholder="Buscar por serviço ou cliente..."
        class="form-control w-100"
        style="max-width: 500px"
      />
    </div>

    <div class="servicos-container mx-auto mb-4 shadow rounded p-3">
      <div v-if="servicosFiltrados.length">
        <div
          v-for="servico in servicosFiltrados"
          :key="servico.id"
          @click="editarServico(servico.id)"
          class="servico-nome px-3 py-2 mb-2 rounded"
        >
          <strong>{{ servico.nome }}</strong><br />
          <small class="text-muted">Cliente: {{ servico.clienteNome }}</small>
        </div>
      </div>
      <div v-else class="text-center text-muted mt-5">
        Nenhum serviço encontrado.
      </div>
    </div>

    <div class="d-flex justify-content-center gap-3">
      <router-link to="/" class="btn btn-secondary">
        Voltar
      </router-link>
      <router-link to="/CadastroServico" class="btn btn-success">
        Novo Serviço
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
  name: "ServicosView",
  setup() {
    const servicos = ref([]);
    const filtro = ref("");
    const router = useRouter();

    const buscarServicos = async () => {
      const querySnapshot = await getDocs(collection(db, "servicos"));
      servicos.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    };

    const servicosFiltrados = computed(() => {
      const termo = (filtro.value || "").toLowerCase();
      return servicos.value.filter(servico =>
        (servico.nome || "").toLowerCase().includes(termo) ||
        (servico.clienteNome || "").toLowerCase().includes(termo)
      );
    });

    const editarServico = (id) => {
      router.push(`/editarServico/${id}`);
    };

    const ocultarFooter = () => {
      const footer = document.querySelector("footer");
      if (footer) {
        footer.style.display = "none";
      }
    };

    onMounted(() => {
      buscarServicos();
      ocultarFooter();
    });

    return {
      servicos,
      filtro,
      servicosFiltrados,
      editarServico
    };
  }
};
</script>

<style scoped>
h1 {
  margin-top: 15px;
}

.container{
  margin-bottom: 300px;
}

.mb-4 {
  margin-bottom: 12px !important;
}

.servicos-container {
  height: 350px;
  overflow-y: auto;
  width: 100%;
  margin-top: 5px;
  max-width: 500px;
  background-color: #ffffff;
}

.servico-nome {
  background-color: #f8f9fa;
  cursor: pointer;
  font-size: 0.95rem;
  color: #000000;
  transition: background-color 0.2s ease;
}

.servico-nome:hover {
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
