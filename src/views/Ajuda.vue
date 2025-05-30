<template>
  <div>
    <div class="ajuda-container">
      <h2>Ajuda do Sistema</h2>
      <div class="ajuda-bloco">
        <h3>Home</h3>
        <p>
          Tela inicial do sistema, onde você pode acessar rapidamente as principais funcionalidades: Clientes, Serviços, Recibos, cadastrar novos clientes e serviços, ou acessar esta tela de ajuda.
        </p>
      </div>
      <div class="ajuda-bloco">
        <h3>Clientes</h3>
        <p>
          Exibe a lista de clientes cadastrados. Permite buscar clientes pelo nome, editar informações ou cadastrar novos clientes.
        </p>
      </div>
      <div class="ajuda-bloco">
        <h3>Cadastro de Cliente</h3>
        <p>
          Formulário para cadastrar um novo cliente, preenchendo nome, CPF, e-mail e telefone.
        </p>
      </div>
      <div class="ajuda-bloco">
        <h3>Editar Cliente</h3>
        <p>
          Permite alterar os dados de um cliente já cadastrado ou excluir o cliente do sistema.
        </p>
      </div>
      <div class="ajuda-bloco">
        <h3>Serviços</h3>
        <p>
          Lista todos os serviços cadastrados. Permite buscar serviços, editar ou cadastrar novos serviços.
        </p>
      </div>
      <div class="ajuda-bloco">
        <h3>Cadastro de Serviço</h3>
        <p>
          Formulário para cadastrar um novo serviço, informando o cliente, data, valor e observações.
        </p>
      </div>
      <div class="ajuda-bloco">
        <h3>Editar Serviço</h3>
        <p>
          Permite alterar os dados de um serviço já cadastrado ou excluir o serviço do sistema.
        </p>
      </div>
      <div class="ajuda-bloco">
        <h3>Recibos</h3>
        <p>
          Exibe todos os recibos gerados, com opções de busca, exportação em PDF, impressão e exclusão de recibos.
        </p>
      </div>
    </div>
    <div class="ajuda-voltar">
      <button class="btn btn-secondary" @click="$router.back()">Voltar</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "AjudaView"
}
</script>

<style scoped>
.ajuda-container {
  max-width: 600px;
  margin: 24px auto 0 auto;
  margin-top: -105px;
  background: #34495e;
  color: #ecf0f1;
  border-radius: 8px;
  padding: 20px 16px;
  box-shadow: 0 2px 16px #0003;
  max-height: 65vh;
  overflow-y: auto;
}

.ajuda-container h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #42b983;
}

.ajuda-bloco {
  margin-bottom: 16px;
}

.ajuda-bloco h3 {
  margin: 0 0 6px 0;
  color: #2ecc71;
  font-size: 1.15rem;
}

.ajuda-bloco p {
  margin: 0;
  font-size: 1rem;
  color: #ecf0f1;
}

.ajuda-voltar {
  display: flex;
  justify-content: center;
  margin-top: 18px;
}

.btn {
  padding: 10px 32px;
  border-radius: 6px;
  border: none;
  background: #888;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn:hover {
  background: #666;
}
</style>