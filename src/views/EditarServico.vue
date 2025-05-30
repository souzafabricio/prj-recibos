<template>
  <div class="container mt-0">
    <h1 class="text-center mb-4">Editar Serviço</h1>
    <div class="card p-4 shadow mx-auto" style="max-width: 500px">
      <form @submit.prevent="salvarEdicao">
        <div class="mb-3">
          <label for="nome" class="form-label">Serviço</label>
          <input type="text" id="nome" v-model="servico.nome" class="form-control" required />
        </div>

        <div class="mb-3">
          <label for="cliente" class="form-label">Cliente</label>
          <select id="cliente" v-model="servico.clienteId" class="form-control" required>
            <option disabled value="">Selecione um cliente</option>
            <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">
              {{ cliente.nome }}
            </option>
          </select>
        </div>

        <div class="linha-data-valor mb-3">
          <div class="campo-data">
            <label for="data" class="form-label">Data de Prestação</label>
            <input type="date" id="data" v-model="servico.data" class="form-control input-data" required />
          </div>
          <div class="campo-valor">
            <label for="valor" class="form-label">Valor</label>
            <input type="number" id="valor" v-model.number="servico.valor" class="form-control input-valor" required step="0.01"/>
          </div>
        </div>

        <div class="mb-3">
          <label for="observacoes" class="form-label">Observações</label>
          <textarea id="observacoes" v-model="servico.observacoes" class="form-control"></textarea>
        </div>

        <div class="d-flex justify-content-between mt-4">
          <button type="button" class="btn btn-secondary me-2" @click="cancelar">
            Voltar
          </button>
          <button type="button" class="btn btn-danger" @click="confirmarExclusao">
            Excluir
          </button>
          <div>
            <button type="submit" class="btn btn-success">
              Salvar
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { db } from "@/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";

export default {
  name: "EditarServico",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const servico = ref({
      nome: "",
      clienteId: "",
      data: "",
      valor: 0,
      observacoes: "",
    });

    const clientes = ref([]);

    const carregarServico = async () => {
      const id = route.params.id;
      const docRef = doc(db, "servicos", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();

        let dataFormatada = "";
        if (data.data instanceof Date) {
          dataFormatada = data.data.toISOString().substr(0, 10);
        } else if (typeof data.data === "string") {
          dataFormatada = data.data.substr(0, 10);
        }

        servico.value = {
          ...data,
          data: dataFormatada,
          valor: data.valor !== undefined && data.valor !== null && data.valor !== ""
            ? Number(data.valor)
            : 0,
        };
      } else {
        alert("Serviço não encontrado.");
        router.back();
      }
    };

    const buscarClientes = async () => {
      const querySnapshot = await getDocs(collection(db, "clientes"));
      clientes.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        nome: doc.data().nome,
      }));
    };

    const salvarEdicao = async () => {
      const id = route.params.id;

      const docRef = doc(db, "servicos", id);
      await updateDoc(docRef, {
        nome: servico.value.nome,
        clienteId: servico.value.clienteId,
        data: servico.value.data,
        valor: servico.value.valor,
        observacoes: servico.value.observacoes,
      });

      const recibosRef = collection(db, "recibos");
      const q = query(recibosRef, where("servicoId", "==", id));
      const querySnapshot = await getDocs(q);

      const cliente = clientes.value.find(c => c.id === servico.value.clienteId);
      const clienteNome = cliente ? cliente.nome : "";

      querySnapshot.forEach(async (reciboDoc) => {
        const reciboRef = doc(db, "recibos", reciboDoc.id);
        await updateDoc(reciboRef, {
          clienteId: servico.value.clienteId,
          clienteNome: clienteNome,
          descricao: servico.value.nome,
          data: servico.value.data,
          valor: servico.value.valor,
          observacoes: servico.value.observacoes || "",
        });
      });

      router.push("/servicos");
    };

    const cancelar = () => {
      router.back();
    };

    const confirmarExclusao = async () => {
      const confirmacao = confirm("Tem certeza que deseja excluir este serviço?");
      if (confirmacao) {
        const id = route.params.id;
        await deleteDoc(doc(db, "servicos", id));
        router.push("/servicos");
      }
    };

    onMounted(() => {
      buscarClientes();
      carregarServico();
    });

    return {
      servico,
      clientes,
      salvarEdicao,
      cancelar,
      confirmarExclusao,
    };
  },
};
</script>


<style>
h1 {
  margin-top: 12px;
}

.container {
  max-width: 500px;
  margin: auto;
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

.linha-data-valor {
  display: flex;
  gap: 16px;
  width: 100%;
}

.campo-data,
.campo-valor {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.input-data {
  max-width: 140px;
  min-width: 200px;
  width: 100%;
}

.input-valor {
  max-width: 140px;
  min-width: 80px;
  width: 100%;
}
</style>
