const cartKey = "lojaEspacialCarrinho";

/*
  Carrega o carrinho do localStorage
 */
function carCarrinho() {
  const saved = localStorage.getItem(cartKey);
  return saved ? JSON.parse(saved) : [];
}

/*
  Atualiza o contador de itens no header
 */
function atualizarContador() {
  const cartCount = document.getElementById("cartCount");
  if (cartCount) {
    const cart = carCarrinho();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems || 0;
  }
}

// Inicialização quando a página carrega

document.addEventListener("DOMContentLoaded", () => {
  // Atualiza contador do carrinho
  atualizarContador();
});

// Sincroniza counter entre abas abertas

window.addEventListener("storage", () => {
  atualizarContador();
});

//carrosel de imagens
let slideIndex = 0;
let autoSlideIntervalo;

// URLs das páginas para cada imagem
const slideLinks = [
  "roupas.html", // Imagem 1
  "acessorios.html", // Imagem 2
  "tenis.html", // Imagem 3
  "esporte.html", // Imagem 4
];

function mostrarSlide(index) {
  const slides = document.querySelectorAll(".carrosel-img");
  const indicators = document.querySelectorAll(".indicator");

  if (index >= slides.length) slideIndex = 0;
  if (index < 0) slideIndex = slides.length - 1;

  slides.forEach((slide) => slide.classList.remove("active"));
  indicators.forEach((ind) => ind.classList.remove("active"));

  slides[slideIndex].classList.add("active");
  indicators[slideIndex].classList.add("active");
}

function proxSlide() {
  slideIndex++;
  mostrarSlide(slideIndex);
  resetAutoSlide();
}

function voltaSlide() {
  slideIndex--;
  mostrarSlide(slideIndex);
  resetAutoSlide();
}

function atualSlide(index) {
  slideIndex = index;
  mostrarSlide(slideIndex);
  resetAutoSlide();
}

function autoSlide() {
  slideIndex++;
  mostrarSlide(slideIndex);
}

function resetAutoSlide() {
  clearInterval(autoSlideIntervalo);
  autoSlideIntervalo = setInterval(autoSlide, 4000);
}

// Função para clicar na imagem e ir para a página
function irSlideLink() {
  const link = slideLinks[slideIndex];
  if (link) {
    window.location.href = link;
  }
}

// Inicia o carrossel automático ao carregar a página
window.addEventListener("load", () => {
  // Adiciona cursor de pointer nas imagens do carrossel
  document.querySelectorAll(".carrosel-img").forEach((img) => {
    img.style.cursor = "pointer";
    img.addEventListener("click", irSlideLink);
  });

  autoSlideIntervalo = setInterval(autoSlide, 4000);
});
