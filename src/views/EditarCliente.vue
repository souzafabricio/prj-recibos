<template>
  <div class="container mt-0">
    <h1 class="text-center mb-4">Editar Cliente</h1>
    <div class="card p-4 shadow mx-auto" style="max-width: 500px">
      <form @submit.prevent="salvarEdicao">
        <div class="mb-3">
          <label for="nome" class="form-label">Nome</label>
          <input
            type="text"
            id="nome"
            v-model="cliente.nome"
            class="form-control"
            required
          />
        </div>

        <div class="mb-3">
          <label for="cpf" class="form-label">CPF/CNPJ</label>
          <input
            type="text"
            id="cpf"
            v-model="cliente.cpf"
            class="form-control"
            maxlength="18"
            @input="mascaraCpfCnpj"
            required
          />
        </div>

        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input
            type="email"
            id="email"
            v-model="cliente.email"
            class="form-control"
            required
          />
        </div>

        <div class="mb-3">
          <label for="telefone" class="form-label">Telefone</label>
          <input
            type="text"
            id="telefone"
            v-model="cliente.telefone"
            class="form-control"
            maxlength="15"
            @input="mascaraTelefone"
            required
          />
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
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

export default {
  name: "EditarCliente",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const cliente = ref({
      nome: "",
      cpf: "",
      email: "",
      telefone: ""
    });

    const carregarCliente = async () => {
      const id = route.params.id;
      const docRef = doc(db, "clientes", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        cliente.value = docSnap.data();
      } else {
        alert("Cliente não encontrado.");
        router.back();
      }
    };

    const salvarEdicao = async () => {
      const id = route.params.id;
      const docRef = doc(db, "clientes", id);
      await updateDoc(docRef, {
        nome: cliente.value.nome,
        cpf: cliente.value.cpf,
        email: cliente.value.email,
        telefone: cliente.value.telefone
      });
      router.push("/clientes");
    };

    const cancelar = () => {
      router.back();
    };

    const confirmarExclusao = async () => {
      const confirmacao = confirm("Tem certeza que deseja excluir este cliente?");
      if (confirmacao) {
        const id = route.params.id;
        await deleteDoc(doc(db, "clientes", id));
        router.push("/clientes");
      }
    };

    // Máscara CPF ou CNPJ (aceita os dois)
    function mascaraCpfCnpj() {
      let v = cliente.value.cpf.replace(/\D/g, ""); // remove tudo que não é dígito

      if (v.length <= 11) {
        // CPF: 000.000.000-00
        v = v.replace(/(\d{3})(\d)/, "$1.$2");
        v = v.replace(/(\d{3})(\d)/, "$1.$2");
        v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      } else {
        // CNPJ: 00.000.000/0000-00
        v = v.replace(/^(\d{2})(\d)/, "$1.$2");
        v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
        v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
        v = v.replace(/(\d{4})(\d)/, "$1-$2");
      }

      cliente.value.cpf = v;
    }

    // Máscara telefone (formato (00) 00000-0000 ou (00) 0000-0000)
    function mascaraTelefone() {
      let v = cliente.value.telefone.replace(/\D/g, ""); // só números

      if (v.length > 10) {
        // com 9 dígitos no celular
        v = v.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
      } else if (v.length > 5) {
        // telefone fixo 8 dígitos
        v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
      } else if (v.length > 2) {
        v = v.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
      } else {
        v = v.replace(/^(\d*)/, "($1");
      }

      cliente.value.telefone = v;
    }

    onMounted(() => {
      carregarCliente();
    });

    return {
      cliente,
      salvarEdicao,
      cancelar,
      confirmarExclusao,
      mascaraCpfCnpj,
      mascaraTelefone
    };
  }
};
</script>
