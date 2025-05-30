<template>
  <div class="container">
    <div class="recibos-header">
      <h1 class="text-center mb-2">Recibos</h1>
      <div class="d-flex justify-content-between mb-3 filtros">
        <input v-model="clienteNome" type="text" placeholder="Cliente" class="form-control me-2"
          @input="filtrarRecibos" />
        <input v-model="dataBusca" type="date" class="form-control me-2" @change="filtrarRecibos" placeholder="Data" />
        <button class="btn-custom" @click="limparFiltros">Limpar</button>
      </div>
    </div>

    <div class="recibos-list card p-4 shadow mx-auto">
      <ul class="list-group">
        <li v-for="recibo in recibosFiltrados" :key="recibo.id"
          class="list-group-item d-flex justify-content-between align-items-center text-dark" style="cursor: pointer"
          @click="abrirModal(recibo)">
          <div>
            {{ recibo.descricao }}<br />
            <small class="text-muted">{{ recibo.clienteNome || '-' }}</small>
          </div>
          <small>{{ formatarData(recibo.data) }}</small>
        </li>
      </ul>
    </div>

    <div class="d-flex justify-content-center mt-4">
      <button type="button" class="btn btn-secondary" @click="voltar">
        Voltar
      </button>
    </div>

    <div v-if="modalAberto" class="modal-backdrop" @click.self="fecharModal">
      <div class="modal-content p-4">
        <span class="modal-close-x" @click="fecharModal">&times;</span>
        <h4>Recibo</h4>
        <br />
        <p><strong>Descrição:</strong> {{ reciboSelecionado.descricao }}</p>
        <p><strong>Cliente:</strong> {{ reciboSelecionado.clienteNome || '-' }}</p>
        <p><strong>Data:</strong> {{ formatarData(reciboSelecionado.data) }}</p>
        <p><strong>Valor:</strong> R$ {{ reciboSelecionado.valor.toFixed(2) }}</p>
        <p><strong>Observações:</strong> {{ reciboSelecionado.observacoes || '-' }}</p>

        <div class="d-flex gap-2 justify-content-center mt-4">
          <button class="btn btn-danger" @click="confirmarExcluir">Excluir Recibo</button>
          <button class="btn btn-primary" @click="exportarPDF">Salvar em PDF</button>
        </div>
      </div>
    </div>

    <div v-if="confirmacaoExcluir" class="modal-backdrop" @click.self="cancelarExcluir">
      <div class="modal-content p-4 text-center">
        <p>Tem certeza que deseja excluir este recibo?</p>
        <div class="d-flex justify-content-center gap-2">
          <button class="btn btn-danger" @click="excluirRecibo">Sim</button>
          <button class="btn btn-secondary" @click="cancelarExcluir">Não</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { ref, onMounted } from "vue";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "vue-router";
import jsPDF from "jspdf";

export default {
  name: "RecibosView",
  setup() {
    const recibos = ref([]);
    const recibosFiltrados = ref([]);
    const clienteNome = ref("");
    const dataBusca = ref("");
    const modalAberto = ref(false);
    const reciboSelecionado = ref(null);
    const confirmacaoExcluir = ref(false);
    const router = useRouter();

    const buscarRecibos = async () => {
      const querySnapshot = await getDocs(collection(db, "recibos"));
      recibos.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      recibosFiltrados.value = [...recibos.value];
    };

    const filtrarRecibos = () => {
      let filtrados = [...recibos.value];

      if (clienteNome.value.trim() !== "") {
        const nomeLower = clienteNome.value.toLowerCase();
        filtrados = filtrados.filter((r) =>
          (r.clienteNome || "").toLowerCase().includes(nomeLower)
        );
      }

      if (dataBusca.value) {
        filtrados = filtrados.filter((r) => r.data === dataBusca.value);
      }

      recibosFiltrados.value = filtrados;
    };

    const limparFiltros = () => {
      clienteNome.value = "";
      dataBusca.value = "";
      recibosFiltrados.value = [...recibos.value];
    };

    const abrirModal = (recibo) => {
      reciboSelecionado.value = recibo;
      modalAberto.value = true;
    };

    const fecharModal = () => {
      modalAberto.value = false;
      reciboSelecionado.value = null;
      confirmacaoExcluir.value = false;
    };

    const confirmarExcluir = () => {
      confirmacaoExcluir.value = true;
    };

    const cancelarExcluir = () => {
      confirmacaoExcluir.value = false;
    };

    const excluirRecibo = async () => {
      if (!reciboSelecionado.value) return;

      try {
        await deleteDoc(doc(db, "recibos", reciboSelecionado.value.id));
        recibos.value = recibos.value.filter(
          (r) => r.id !== reciboSelecionado.value.id
        );
        recibosFiltrados.value = recibosFiltrados.value.filter(
          (r) => r.id !== reciboSelecionado.value.id
        );
        fecharModal();
      } catch (error) {
        alert("Erro ao excluir recibo: " + error.message);
      }
    };

    const exportarPDF = () => {
      if (!reciboSelecionado.value) return;

      const docPDF = new jsPDF();

      const pageWidth = docPDF.internal.pageSize.getWidth();
      const pageHeight = docPDF.internal.pageSize.getHeight();

      // Adicionar logo grande centralizada
      const logo = new Image();
      logo.src = require('@/assets/logopreta.png');
      logo.onload = () => {
        const logoWidth = 120;
        const logoHeight = 100;
        const logoX = (pageWidth - logoWidth) / 2;
        docPDF.addImage(logo, 'PNG', logoX, -50, logoWidth, logoHeight);

        // Título centralizado "RECIBO"
        docPDF.setFontSize(16);
        docPDF.setFont("helvetica", "bold");
        docPDF.text("RECIBO", pageWidth / 2, 75, { align: "center" });

        // Caixa com os dados
        const startY = 85;
        const boxPadding = 10;
        const boxWidth = pageWidth - 40;
        const boxX = 20;
        let cursorY = startY;

        docPDF.setFontSize(12);
        docPDF.setFont("helvetica", "normal");

        // Desenhar a caixa
        docPDF.rect(boxX, cursorY, boxWidth, 80);
        cursorY += boxPadding;

        // Cliente (esquerda) e Data (direita)
        docPDF.text(`Cliente: ${reciboSelecionado.value.clienteNome || "-"}`, boxX + 5, cursorY);
        const dataTexto = `Serviço prestado em: ${formatarData(reciboSelecionado.value.data)}`;
        docPDF.text(dataTexto, boxX + boxWidth - docPDF.getTextWidth(dataTexto) - 5, cursorY);
        cursorY += 10;

        // Descrição
        docPDF.text(`Descrição: ${reciboSelecionado.value.descricao}`, boxX + 5, cursorY);
        cursorY += 10;

        // Valor
        docPDF.text(`Valor: R$ ${reciboSelecionado.value.valor.toFixed(2)}`, boxX + 5, cursorY);
        cursorY += 10;

        // Observações com quebra de linha
        const observacoes = reciboSelecionado.value.observacoes || "-";
        docPDF.text("Observações:", boxX + 5, cursorY);
        cursorY += 7;
        const linhasObs = docPDF.splitTextToSize(observacoes, boxWidth - 10);
        docPDF.text(linhasObs, boxX + 5, cursorY);

        // Assinaturas no final da página
        const assinaturaY = pageHeight - 40;
        docPDF.line(30, assinaturaY, 90, assinaturaY);
        docPDF.text("Assinatura do Responsável", 35, assinaturaY + 5);

        docPDF.line(120, assinaturaY, 180, assinaturaY);
        docPDF.text("Assinatura do Cliente", 130, assinaturaY + 5);

        const nomeCliente = reciboSelecionado.value.clienteNome
          ? reciboSelecionado.value.clienteNome.replace(/\s+/g, "_")
          : "cliente";
        const dataRecibo = reciboSelecionado.value.data
          ? formatarData(reciboSelecionado.value.data).replace(/\//g, "-")
          : "data";

        const nomeArquivo = `recibo_${nomeCliente}_${dataRecibo}.pdf`;
        docPDF.save(nomeArquivo);
      };
    };



    const imprimirRecibo = () => {
      if (!reciboSelecionado.value) return;

      const conteudo = `
    <div style="text-align: center; font-family: Arial, sans-serif;">
      <img src="${require('@/assets/logojoaog.png')}" alt="Logo" style="width: 100px; margin-bottom: 20px;" />
      <div style="border: 1px solid #000; padding: 20px; display: inline-block; text-align: center;">
        <h3>RECIBO</h3> 
        <p><strong>Descrição:</strong> ${reciboSelecionado.value.descricao}</p>
        <p><strong>Cliente:</strong> ${reciboSelecionado.value.clienteNome || "-"}</p>
        <p><strong>Data:</strong> ${formatarData(reciboSelecionado.value.data)}</p>
        <p><strong>Valor:</strong> R$ ${reciboSelecionado.value.valor.toFixed(2)}</p>
        <p><strong>Observações:</strong> ${reciboSelecionado.value.observacoes || "-"}</p>
      </div>
      <div style="margin-top: 80px; display: flex; justify-content: space-around;">
        <div style="text-align: center;">
          <div style="border-top: 1px solid #000; width: 200px; margin: 0 auto;"></div>
          <p>Assinatura do Responsável</p>
        </div>
        <div style="text-align: center;">
          <div style="border-top: 1px solid #000; width: 200px; margin: 0 auto;"></div>
          <p>Assinatura do Cliente</p>
        </div>
      </div>
    </div>
  `;

      const janela = window.open("", "", "width=800,height=600");
      janela.document.write(`<html><head><title>Recibo</title></head><body>${conteudo}</body></html>`);
      janela.document.close();
      janela.focus();
      janela.print();
      janela.close();
    };


    const voltar = () => {
      router.back();
    };

    const formatarData = (dataStr) => {
      if (!dataStr) return "-";
      const [ano, mes, dia] = dataStr.split("-");
      return `${dia}/${mes}/${ano}`;
    };

    onMounted(() => {
      buscarRecibos();
    });

    

    return {
      recibosFiltrados,
      clienteNome,
      dataBusca,
      modalAberto,
      reciboSelecionado,
      confirmacaoExcluir,
      abrirModal,
      fecharModal,
      confirmarExcluir,
      cancelarExcluir,
      excluirRecibo,
      exportarPDF,
      imprimirRecibo,
      filtrarRecibos,
      limparFiltros,
      voltar,
      formatarData,
    };
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 500px;
  margin: 0 auto 32px auto;
  padding: 0;
  border-radius: 8px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 90vh;
  min-height: 100px;
}

.recibos-header {
  position: sticky;
  top: 0;
  z-index: 2;
  padding: 14px 12px 0 12px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.filtros {
  padding-bottom: 8px;
}

.recibos-list {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 24px 12px 32px 12px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  max-width: 700px;
  width: 100%; 
  margin: 0 auto;
  max-height: 360px;;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  color: rgb(35, 35, 35);
  position: relative;
}

.modal-close-x {
  position: absolute;
  top: 12px;
  right: 16px;
  font-size: 1.5rem;
  font-weight: bold;
  color: #888;
  cursor: pointer;
  transition: color 0.2s;
  z-index: 2;
}

.modal-close-x:hover {
  color: #222;
}

.btn-secondary {
  background-color: #888;
}

.btn-secondary:hover {
  background-color: #666;
}

.btn-custom {
  background-color: #f5f6fa;
  color: #222;
  border: 1px solid #bbb;
  border-radius: 6px;
  padding: 7px 1px;
  font-size: 0.8rem;
  font-weight: 500;
  transition: background 0.2s, color 0.2s, border 0.2s;
  cursor: pointer;
  outline: none;
  box-shadow: 0 1px 2px rgba(60, 60, 60, 0.04);
}

.btn-custom:hover,
.btn-custom:focus {
  background-color: #e1e3ea;
  color: #111;
  border-color: #888;
}

.btn-custom:active {
  background-color: #d1d3da;
  color: #111;
  border-color: #666;
}

h1.text-center.mb-2 {
  margin-top: 0;
  margin-bottom: 8px;
}

input[type="date"].form-control {
  font-size: 0.92rem;
  padding-right: 2px;
}

</style>
