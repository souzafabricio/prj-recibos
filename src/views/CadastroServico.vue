<template>
  <div class="cadastrar-cliente">
    <h2>Registrar Serviço</h2>
    <form @submit.prevent="cadastrarServico">
      <div>
        <label for="nome">Serviço:</label>
        <input id="nome" v-model="nome" required />
      </div>

      <div class="cliente-busca-wrapper">
        <label for="cliente">Buscar Cliente:</label>
        <input id="cliente" v-model="clienteBusca" @focus="mostrarLista = true" @input="filtrarClientes"
          @blur="esconderLista" placeholder="Digite o nome do cliente" autocomplete="off" />
        <div v-if="mostrarLista" class="lista-clientes-box" @mousedown.prevent>
          <ul class="lista-clientes">
            <li v-for="cliente in clientesFiltrados" :key="cliente.id" @mousedown.prevent="selecionarCliente(cliente)"
              :class="{ selecionado: clienteSelecionado && clienteSelecionado.id === cliente.id }">
              {{ cliente.nome }}
            </li>
          </ul>
        </div>
      </div>

      <div class="linha-data-valor">
        <div class="campo-data">
          <label for="data">Data de Prestação:</label>
          <input id="data" type="date" v-model="data" required class="input-data" />
        </div>
        <div class="campo-valor">
          <label for="valor">Valor (R$):</label>
          <input id="valor" v-model="valor" type="number" step="0.01" required @input="formatarValor" />
        </div>
      </div>

      <div>
        <label for="observacoes">Observações:</label>
        <textarea id="observacoes" v-model="observacoes" rows="3"></textarea>
      </div>

      <div class="botoes">
        <button type="button" class="btn btn-secondary botao-voltar" @click="voltar">
          Voltar
        </button>
        <button type="submit" class="btn btn-success botao-cadastrar">
          Cadastrar
        </button>
      </div>
    </form>

    <p v-if="mensagem">{{ mensagem }}</p>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default {
  name: "CadastrarServico",
  setup() {
    const nome = ref("");
    const clienteBusca = ref("");
    const clienteSelecionado = ref(null);
    const data = ref("");
    const valor = ref("");
    const observacoes = ref("");
    const mensagem = ref("");
    const clientes = ref([]);
    const clientesFiltrados = ref([]);
    const mostrarLista = ref(false);

    const buscarClientes = async () => {
      const querySnapshot = await getDocs(collection(db, "clientes"));
      clientes.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      clientesFiltrados.value = clientes.value;
    };

    const filtrarClientes = () => {
      const busca = clienteBusca.value.toLowerCase();
      clientesFiltrados.value = busca
        ? clientes.value.filter(cliente =>
          cliente.nome.toLowerCase().includes(busca)
        )
        : clientes.value;
    };

    const selecionarCliente = (cliente) => {
      clienteSelecionado.value = cliente;
      clienteBusca.value = cliente.nome;
      mostrarLista.value = false;
    };

    const esconderLista = () => {
      setTimeout(() => {
        mostrarLista.value = false;
      }, 150);
    };

    const router = useRouter();

    const cadastrarServico = async () => {
      if (
        !nome.value ||
        !clienteSelecionado.value ||
        !data.value ||
        !valor.value
      ) {
        mensagem.value = "Preencha todos os campos obrigatórios!";
        return;
      }

      try {
        const servicoRef = await addDoc(collection(db, "servicos"), {
          nome: nome.value,
          clienteId: clienteSelecionado.value.id,
          clienteNome: clienteSelecionado.value.nome,
          data: data.value,
          valor: parseFloat(valor.value),
          observacoes: observacoes.value,
          dataCadastro: new Date().toISOString()
        });

        await addDoc(collection(db, "recibos"), {
          servicoId: servicoRef.id,
          clienteId: clienteSelecionado.value.id,
          clienteNome: clienteSelecionado.value.nome,
          descricao: nome.value,
          data: data.value,
          valor: parseFloat(valor.value),
          observacoes: observacoes.value || "",
          geradoEm: new Date().toISOString()
        });

        router.push("/Servicos");

      } catch (error) {
        mensagem.value = "Erro ao cadastrar: " + error.message;
      }
    };

    onMounted(() => {
      buscarClientes();
    });

    const formatarValor = (event) => {
      let v = event.target.value.replace(/\D/g, "");
      v = (parseInt(v, 10) / 100).toFixed(2);
      event.target.value = v;
      valor.value = v;
    };

    const voltar = () => {
      router.back();
    };

    return {
      nome,
      clienteBusca,
      clienteSelecionado,
      data,
      valor,
      observacoes,
      mensagem,
      clientesFiltrados,
      mostrarLista,
      cadastrarServico,
      selecionarCliente,
      filtrarClientes,
      esconderLista,
      formatarValor,
      voltar
    };
  }
};
</script>

<style scoped>
.cadastrar-cliente {
  max-width: 450px;
  margin-bottom: 5000px;
  padding: 40px;
  background: #34495e;
  color: #ecf0f1;
  border-radius: 8px;
  position: relative;
}

.cadastrar-cliente h2 {

  margin-bottom: 1px;
}

.form-group {
  width: 100%;
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

label {
  margin-top: 5px;
  width: 100%;
  text-align: left;
}

input,
textarea {
  width: 100%;
  padding: 10px;
  margin-top: 4px;
  border-radius: 4px;
  border: none;
  font-size: 1.1rem;
}

.linha-data-valor {
  display: flex;
  gap: 16px;
  width: 100%;
  max-width: 700px;
  margin-bottom: 8px;
  margin-top: 3px;
}

.campo-data,
.campo-valor {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.input-data,
.campo-valor input {
  background: #fff;
  color: #222;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  padding: 10px;
  margin-top: 4px;
  width: 100%;
  box-sizing: border-box;
  height: 45px;
  outline: none;
  transition: border 0.2s;
}

.input-data:focus,
.campo-valor input:focus {
  border: 2px solid #42b983;
}

.input-data {
  max-width: 140px;
  min-width: 80px;
}

.campo-valor input {
  max-width: 100%;
}

.botoes {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.botao-voltar,
.botao-cadastrar {
  flex: 1;
  text-align: center;
}

#observacoes {
  margin-top: 0 !important;
}

.btn {
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  text-decoration: none;
  color: white;
  display: inline-block;
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

.cliente-busca-wrapper {
  position: relative;
}

.lista-clientes-box {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 10;
  width: 100%;
  max-height: 150px;
  overflow-y: auto;
  background: #fff;
  color: #222;
  border: 1px solid #2980b9;
  border-radius: 4px;
  margin-top: 2px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.lista-clientes {
  list-style: none;
  margin: 0;
  padding: 0;
}

.lista-clientes li {
  padding: 6px 10px;
  cursor: pointer;
  border-bottom: 1px solid #e3eaf3;
  color: #222;
  background: #fff;
}

.lista-clientes li:last-child {
  border-bottom: none;
}

.lista-clientes li:hover,
.lista-clientes li.selecionado {
  background: #2980b9;
  color: #fff;
}
</style>
