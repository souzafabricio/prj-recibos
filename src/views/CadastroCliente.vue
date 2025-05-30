<template>
  <div class="cadastrar-cliente">
    <h2>Cadastrar Cliente</h2>
    <form @submit.prevent="cadastrarCliente">
      <div>
        <label for="nome">Nome:</label>
        <input id="nome" v-model="nome" required />
      </div>
      <div>
        <label for="cpf">CPF/CNPJ:</label>
        <input id="cpf" v-model="cpf" @input="formatarCpfCnpj" maxlength="18" required />
      </div>
      <div>
        <label for="email">Email:</label>
        <input id="email" v-model="email" type="email" required />
      </div>
      <div>
        <label for="telefone">Telefone:</label>
        <input id="telefone" v-model="telefone" @input="formatarTelefone" maxlength="15" required />
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default {
  name: "CadastrarCliente",
  setup() {
    const router = useRouter();
    const nome = ref("");
    const cpf = ref("");
    const email = ref("");
    const telefone = ref("");
    const mensagem = ref("");

    const cadastrarCliente = async () => {
      if (!nome.value || !cpf.value || !email.value || !telefone.value) {
        mensagem.value = "Preencha todos os campos!";
        return;
      }

      try {
        await addDoc(collection(db, "clientes"), {
          nome: nome.value,
          cpf: cpf.value,
          email: email.value,
          telefone: telefone.value,
          dataCadastro: new Date().toISOString(),
        });
        mensagem.value = "Cadastrado com sucesso!";
        nome.value = "";
        cpf.value = "";
        email.value = "";
        telefone.value = "";
      } catch (error) {
        mensagem.value = "Erro ao cadastrar cliente: " + error.message;
      }
    };

    const formatarCpfCnpj = () => {
      let valor = cpf.value.replace(/\D/g, "");

      if (valor.length <= 11) {
        // Formato CPF: 000.000.000-00
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      } else {
        // Formato CNPJ: 00.000.000/0000-00
        valor = valor.replace(/^(\d{2})(\d)/, "$1.$2");
        valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
        valor = valor.replace(/\.(\d{3})(\d)/, ".$1/$2");
        valor = valor.replace(/(\d{4})(\d{1,2})$/, "$1-$2");
      }

      cpf.value = valor;
    };

    const formatarTelefone = () => {
      let valor = telefone.value.replace(/\D/g, "");

      if (valor.length <= 10) {
        // Fixo: (11) 1234-5678
        valor = valor.replace(/(\d{2})(\d)/, "($1) $2");
        valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
      } else {
        // Celular: (11) 91234-5678
        valor = valor.replace(/(\d{2})(\d)/, "($1) $2");
        valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
      }

      telefone.value = valor;
    };


    const voltar = () => {
      router.back();
    };

    return {
      nome,
      cpf,
      email,
      telefone,
      mensagem,
      cadastrarCliente,
      voltar,
      formatarCpfCnpj,
      formatarTelefone,
    };
  },
};
</script>

<style scoped>
.cadastrar-cliente {
  max-width: 900px;
  margin: 40px auto;
  padding: 40px;
  background: #34495e;
  color: #ecf0f1;
  border-radius: 8px;
  margin-bottom: 240px;
}

label {
  margin-top: 5px;
}

input {
  width: 100%;
  padding: 6px;
  margin-top: 4px;
  border-radius: 4px;
  border: none;
}

.botoes {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.botao-voltar,
.botao-cadastrar {
  flex: 1;
  text-align: center;
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
</style>
