const cartKey = "lojaEspacialCarrinho";

/**
 * Carrega o carrinho do localStorage
 * Retorna os itens do carrinho armazenados ou um array vazio se não houver dados salvos.
 */
function carCarrinho() {
  const saved = localStorage.getItem(cartKey);
  return saved ? JSON.parse(saved) : [];
}

/**
 * Salva o carrinho no localStorage
 * Converte o carrinho para uma string JSON e armazena no localStorage.
 */
function salvarCarrinho(cart) {
  localStorage.setItem(cartKey, JSON.stringify(cart));
}

/**
 * Atualiza o contador de itens no header
 * Calcula o número total de itens no carrinho e atualiza o contador exibido no cabeçalho.
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
 * Renderiza os itens do carrinho na página
 * Exibe os itens do carrinho na interface, calculando os subtotais e total.
 * Também permite remover itens e atualizar o carrinho.
 */
function renderCartItems(cart) {
  const cartItemsContainer = document.querySelector(".cart-items");
  const totalDisplay = document.getElementById("total");

  // Verifica se o container dos itens do carrinho existe
  if (!cartItemsContainer) return;

  // Limpa a área de itens antes de renderizar novamente
  cartItemsContainer.innerHTML = "";

  // Se o carrinho estiver vazio, exibe a mensagem "Carrinho vazio"
  if (cart.length === 0) {
    cartItemsContainer.innerHTML =
      '<p class="empty-message">Carrinho vazio.</p>';
    if (totalDisplay) totalDisplay.textContent = "Total: R$ 0,00";
    return;
  }

  let total = 0;

  // Para cada item no carrinho, cria o HTML correspondente e calcula o subtotal
  cart.forEach((item, index) => {
    const subtotal = item.preco * item.quantity;
    total += subtotal;

    const itemDiv = document.createElement("div");
    itemDiv.classList.add("cart-item");
    itemDiv.innerHTML = `
      <h3>${item.nome}</h3>
      <p>Tamanho: ${item.tamanho}</p>
      <p>Preço unitário: R$ ${item.preco.toFixed(2)}</p>
      <p>Quantidade: ${item.quantity}</p>
      <p>Subtotal: R$ ${subtotal.toFixed(2)}</p>
      <button class="remove-btn" data-index="${index}">Excluir</button>
    `;
    cartItemsContainer.appendChild(itemDiv);
  });

  // Atualiza o total do carrinho
  if (totalDisplay) {
    totalDisplay.textContent = `Total: R$ ${total.toFixed(2)}`;
  }

  // Adiciona eventos aos botões de "Excluir" para remover itens do carrinho
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.index);
      // Remove o item do carrinho e atualiza a interface
      cart.splice(idx, 1);
      salvarCarrinho(cart);
      renderCartItems(cart);
      atualizarContador();
    });
  });
}

/**
 * Limpa todo o carrinho
 * Exibe uma confirmação e, se o usuário confirmar, limpa o carrinho do localStorage e da interface.
 */
function limparCarrinho() {
  if (confirm("Tem certeza que deseja limpar todo o carrinho?")) {
    localStorage.removeItem(cartKey);
    renderCartItems([]); // Limpa os itens exibidos
    atualizarContador(); // Atualiza o contador do carrinho
  }
}

// ============================================
// Inicialização quando a página carrega
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  const cart = carCarrinho(); // Carrega o carrinho do localStorage
  const enderecoInput = document.getElementById("endereco");
  const confirmBtn = document.getElementById("confirm-btn");

  // Atualiza o contador do carrinho
  atualizarContador();

  // Renderiza os itens do carrinho na página
  renderCartItems(cart);

  // Configura o botão de confirmar compra
  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      const endereco = enderecoInput ? enderecoInput.value.trim() : "";

      // Verifica se o carrinho está vazio
      if (cart.length === 0) {
        alert(
          "Seu carrinho está vazio. Adicione produtos antes de confirmar a compra."
        );
        return;
      }

      // Verifica se o endereço informado é válido
      if (endereco.length < 10) {
        alert("Por favor, informe um endereço de entrega válido.");
        if (enderecoInput) enderecoInput.focus();
        return;
      }

      // Exibe um resumo da compra
      const totalDisplay = document.getElementById("total");
      const totalText = totalDisplay
        ? totalDisplay.textContent.replace("Total: ", "")
        : "R$ 0,00";

      alert(`Compra confirmada!\n\nTotal: ${totalText}\nEndereço: ${endereco}`);

      // Limpa o carrinho após a compra
      localStorage.removeItem(cartKey);
      if (enderecoInput) enderecoInput.value = ""; // Limpa o campo de endereço
      renderCartItems([]); // Limpa os itens do carrinho na interface
      atualizarContador(); // Atualiza o contador de itens no carrinho
    });
  }
});

// Configura o botão de limpar o carrinho
const limparBtn = document.getElementById("limparBtn");

if (limparBtn) {
  limparBtn.addEventListener("click", limparCarrinho);
}

// ============================================
// Sincroniza counter entre abas abertas
// ============================================
window.addEventListener("storage", () => {
  // Atualiza o contador e os itens do carrinho quando houver mudanças no localStorage em outra aba
  atualizarContador();
  const cart = carCarrinho(); // Carrega o carrinho novamente
  renderCartItems(cart); // Re-renderiza os itens do carrinho
});
