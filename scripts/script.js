const cartKey = "lojaEspacialCarrinho";

/**
 * Carrega o carrinho do localStorage
 * Retorna o carrinho armazenado ou um array vazio caso não exista no localStorage.
 */
function carCarrinho() {
  const saved = localStorage.getItem(cartKey);
  return saved ? JSON.parse(saved) : [];
}

/**
 * Salva o carrinho no localStorage
 * Armazena o carrinho atualizado no localStorage como uma string JSON.
 */
function salvarCarrinho(cart) {
  localStorage.setItem(cartKey, JSON.stringify(cart));
}

/**
 * Atualiza o contador de itens no header
 * Calcula o número total de itens no carrinho e atualiza o contador exibido no header.
 */
function atualizarContador() {
  const cartCount = document.getElementById("cartCount");
  if (cartCount) {
    const cart = carCarrinho();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems || 0;
  }
}

/**
 * Inicializa os botões de adicionar ao carrinho
 * Adiciona os event listeners nos botões de "Adicionar ao Carrinho" para capturar o clique e adicionar os produtos ao carrinho.
 */
function iniCarButton() {
  const addBtns = document.querySelectorAll(".addBtn");

  addBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();

      // Obtém dados do produto a partir do card
      const card = btn.closest(".productCard");
      if (!card) {
        console.error("Não foi possível encontrar o card do produto");
        return;
      }

      const id = parseInt(card.dataset.id);
      const nome = card.dataset.nome;
      const preco = parseFloat(card.dataset.preco);
      const selecTamanho = card.querySelector("select");
      const tamanho = selecTamanho ? selecTamanho.value : "M";

      // Valida dados
      if (!id || !nome || !preco) {
        console.error("Dados do produto inválidos", { id, nome, preco });
        return;
      }

      // Carrega carrinho atual
      let cart = carCarrinho();

      // Verifica se item já existe com mesmo tamanho
      const existItem = cart.find((i) => i.id === id && i.tamanho === tamanho);
      if (existItem) {
        existItem.quantity++;
      } else {
        cart.push({ id, nome, preco, tamanho, quantity: 1 });
      }

      // Salva carrinho
      salvarCarrinho(cart);

      // Atualiza contador
      atualizarContador();

      // Feedback visual do botão
      const originalText = btn.textContent;
      const originalColor = btn.style.backgroundColor;

      btn.textContent = "✓ Item adicionado!";
      btn.style.backgroundColor = "#55aa55";
      btn.disabled = true;

      // Restaura botão após 2 segundos
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = originalColor;
        btn.disabled = false;
      }, 2000);
    });
  });
}

// ============================================
// Inicialização quando a página carrega
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  // Atualiza contador do carrinho
  atualizarContador();

  // Inicializa botões de adicionar ao carrinho
  iniCarButton();
});

// ============================================
// Sincroniza counter entre abas abertas
// ============================================
window.addEventListener("storage", () => {
  // Atualiza o contador do carrinho quando houver alterações no localStorage em outra aba
  atualizarContador();
});
