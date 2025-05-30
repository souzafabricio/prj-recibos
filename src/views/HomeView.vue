<template>
  <div class="home">
    <h3>Bem Vindo ao Sistema de Gestão de Clientes e Recibos</h3>
    <p>Opções</p>
    <button @click="goTo('clientes')">Clientes</button>
    <button @click="goTo('servicos')">Serviços</button>
    <button @click="goTo('recibos')">Recibos</button>
    <p>Menu Rápido</p>
    <button @click="goTo('CadastroServico')">Novo Serviço</button>
    <button @click="goTo('CadastroCliente')">Novo Cliente</button>
    <div class="ajuda-sobre-row">
      <button @click="goTo('Ajuda')">Ajuda</button>
      <button @click="goTo('Sobre')">Sobre</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  methods: {
    goTo(routeName) {
      this.$router.push({ name: routeName });
    }
  }
}
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: center;
  margin-top: -70px;
  padding: 0 8px;
  width: 100%;
  max-width: 420px;
  min-height: 0;
  margin-left: auto;
  margin-right: auto;

}

button {
  padding: 12px 0;
  font-size: 1rem;
  border: none;
  border-radius: 10px;
  background: linear-gradient(90deg, #42b983 60%, #2ecc71 100%);
  color: #fff;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(34, 49, 63, 0.10), 0 1.5px 4px #2ecc7133;
  cursor: pointer;
  transition: 
    background 0.3s,
    transform 0.12s,
    box-shadow 0.2s;
  outline: none;
  width: 100%;
  max-width: 320px;
}

.ajuda-sobre-row {
  display: flex;
  gap: 12px;
  width: 100%;
  justify-content: flex-end;
  margin-top: 0;
}

h3 {
  margin: 0;
  position: relative;
  top: 10px;
  font-size: 1.6rem;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 1px;
  text-shadow: 1px 2px 8px #0008;
  padding-bottom: 8px;
  transition: color 0.3s;
  text-align: center;
  word-break: break-word;
}

h3:hover {
  color: #2ecc71;
}

p {
  margin: 12px 0 0 0;
  color: #dadcde;
  font-weight: 500;
  font-size: 1.05rem;
  letter-spacing: 1px;
  text-align: center;
}

@media (max-width: 500px) {
  .home {
    max-width: 98vw;
    padding: 0 2vw;
    gap: 10px;
  }
  button {
    max-width: 100%;
    font-size: 0.98rem;
    padding: 11px 0;
  }
  h3 {
    font-size: 1.15rem;
    margin-top: -18px;
  }
  .ajuda-sobre-row {
    gap: 8px;
  }
}
</style>