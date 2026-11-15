// 1. Lógica do Menu
const botaoMenu = document.getElementById('menu-button');
const nav = document.getElementById('menu');

if (botaoMenu && nav) {
    botaoMenu.addEventListener('click', function () {
        nav.classList.toggle('oculto');
    });
}

// 2. Função reutilizável para os dois carrosséis
function iniciarCarrossel(secao) {
    if (!secao) return;

    const btnEsquerda = secao.querySelector('.botao.esquerda');
    const btnDireita = secao.querySelector('.botao.direita');
    
    // Pega tanto '.personagem' (da 1ª seção) quanto '.membro' (da 2ª seção)
    const itens = secao.querySelectorAll('.carrosel .personagem, .carrosel .membro');
    const containerIndicadores = secao.querySelector('.indicadores');

    if (itens.length === 0) return;

    let indiceAtual = 0;
    let emTransicao = false;

    // Cria as bolinhas indicadoras (se existir a div .indicadores na seção)
    if (containerIndicadores) {
        itens.forEach((_, index) => {
            const bola = document.createElement('div');
            bola.classList.add('bola');
            if (index === 0) bola.classList.add('ativa');

            bola.addEventListener('click', () => {
                if (emTransicao || index === indiceAtual) return;
                const direcao = index > indiceAtual ? 'direita' : 'esquerda';
                transicionarParaIndice(index, direcao);
            });

            containerIndicadores.appendChild(bola);
        });
    }

    function atualizarIndicadores() {
        if (!containerIndicadores) return;
        const bolas = containerIndicadores.querySelectorAll('.bola');
        bolas.forEach((bola, index) => {
            if (index === indiceAtual) {
                bola.classList.add('ativa');
            } else {
                bola.classList.remove('ativa');
            }
        });
    }

    function transicionarItem(novaDirecao) {
        if (emTransicao) return;
        let novoIndice;
        if (novaDirecao === 'direita') {
            novoIndice = (indiceAtual + 1) % itens.length;
        } else {
            novoIndice = (indiceAtual - 1 + itens.length) % itens.length;
        }
        transicionarParaIndice(novoIndice, novaDirecao);
    }

    function transicionarParaIndice(novoIndice, direcao) {
        emTransicao = true;
        const itemAtual = itens[indiceAtual];

        if (direcao === 'direita') {
            itemAtual.classList.add('sai-para-esquerda');
        } else {
            itemAtual.classList.add('sai-para-direita');
        }

        indiceAtual = novoIndice;
        const proximoItem = itens[indiceAtual];
        atualizarIndicadores();

        setTimeout(() => {
            itemAtual.classList.remove('visto', 'sai-para-esquerda', 'sai-para-direita');

            if (direcao === 'direita') {
                proximoItem.classList.add('vem-da-direita');
            } else {
                proximoItem.classList.add('vem-da-esquerda');
            }

            void proximoItem.offsetWidth;
            proximoItem.classList.remove('vem-da-direita', 'vem-da-esquerda');
            proximoItem.classList.add('visto');
            emTransicao = false;
        }, 400);
    }

    if (btnDireita) {
        btnDireita.addEventListener('click', () => transicionarItem('direita'));
    }
    if (btnEsquerda) {
        btnEsquerda.addEventListener('click', () => transicionarItem('esquerda'));
    }
}

// 3. Ativa o carrossel nas suas duas seções específicas
const secaoPersonagens = document.getElementById('personagem');
const secaoEquipe = document.getElementById('equipe');

iniciarCarrossel(secaoPersonagens);
iniciarCarrossel(secaoEquipe);

function abrirModal(elementoImg) {
  const modal = document.getElementById("meuModal");
  const imgExpandida = document.getElementById("imgExpandida");
  const legenda = document.getElementById("legenda");

  modal.style.display = "flex";
  imgExpandida.src = elementoImg.src;
  legenda.innerHTML = elementoImg.alt; // Usa o texto do 'alt' como legenda
}

function fecharModal() {
  document.getElementById("meuModal").style.display = "none";
}

// Fecha também ao apertar a tecla ESC
document.addEventListener('keydown', function(event) {
  if (event.key === "Escape") {
    fecharModal();
  }
});

{
  const fotosGaleria = document.querySelectorAll('.grade-galeria img');
  const modalGaleria = document.getElementById('modal-galeria');
  const imgModalGaleria = document.getElementById('img-modal-galeria');
  const legendaGaleria = document.getElementById('legenda-galeria');
  const contadorGaleria = document.getElementById('contador-galeria');

  let indiceGaleria = 0;

  // Abre o modal apenas quando clicar nas imagens dentro de .grade-galeria
  fotosGaleria.forEach((img, index) => {
    img.addEventListener('click', () => {
      indiceGaleria = index;
      atualizarModalGaleria();
      modalGaleria.style.display = 'flex';
    });
  });

  function atualizarModalGaleria() {
    const fotoAtual = fotosGaleria[indiceGaleria];
    imgModalGaleria.src = fotoAtual.src;
    legendaGaleria.textContent = fotoAtual.alt;
    contadorGaleria.textContent = `${indiceGaleria + 1} / ${fotosGaleria.length}`;
  }

  // Funções globais vinculadas aos botões do HTML
  window.mudarFotoGaleria = function(direcao, event) {
    if (event) event.stopPropagation();
    indiceGaleria += direcao;

    if (indiceGaleria >= fotosGaleria.length) {
      indiceGaleria = 0;
    } else if (indiceGaleria < 0) {
      indiceGaleria = fotosGaleria.length - 1;
    }

    atualizarModalGaleria();
  };

  window.fecharModalGaleria = function(event) {
    if (event.target === modalGaleria || event.target.classList.contains('fechar-galeria')) {
      modalGaleria.style.display = 'none';
    }
  };

  // Teclado funciona apenas quando o modal da galeria estiver aberto
  document.addEventListener('keydown', (event) => {
    if (modalGaleria.style.display === 'flex') {
      if (event.key === 'ArrowRight') window.mudarFotoGaleria(1);
      if (event.key === 'ArrowLeft') window.mudarFotoGaleria(-1);
      if (event.key === 'Escape') modalGaleria.style.display = 'none';
    }
  });
}
