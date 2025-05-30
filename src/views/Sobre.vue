<template>
  <div class="sobre-container">
    <h2>Sobre o Sistema</h2>
    <p>
      Este sistema foi desenvolvido em maio de 2025 por <strong>Fabrício de Souza Fonseca</strong>.
    </p>
    <p>
      Caso tenha dúvidas, sugestões ou precise de suporte, entre em contato pelo e-mail:<br>
      <a href="mailto:fabriciosouzafonsecalu93@gmail.com">fabriciosouzafonsecalu93@gmail.com</a>
    </p>
    <p>
        Ou também pelo WhatsApp:<br>
      <a href="https://wa.me/5519996353086" target="_blank">+55 19 99635-3086</a>
    </p>
    <div class="sobre-voltar">
      <button class="btn btn-secondary" @click="$router.back()">Voltar</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SobreView"
}
</script>

<style scoped>
.sobre-container {
  max-width: 500px;
  margin: 40px auto;
  background: #34495e;
  color: #ecf0f1;
  border-radius: 8px;
  padding: 32px 24px;
  box-shadow: 0 2px 16px #0003;
  text-align: center;
  margin-top: -45px;
}

.sobre-container h2 {
  color: #42b983;
  margin-bottom: 18px;
}

.sobre-container a {
  color: #42b983;
  text-decoration: underline;
  word-break: break-all;
}

.sobre-voltar {
  display: flex;
  justify-content: center;
  margin-top: 24px;
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