document.addEventListener('DOMContentLoaded', function() {
    // --- SLIDESHOW ---
    let slideIndex = 0;
    const slides = document.querySelectorAll('.slide');
    const bolinhas = document.querySelectorAll('.bolinha');
    const totalSlides = slides.length;
    let autoSlideInterval;
    const autoSlideDelay = 3000;

    function mostrarSlide(n) {
        slides.forEach(slide => slide.classList.remove('ativo'));
        bolinhas.forEach(bolinha => bolinha.classList.remove('ativo'));
        slideIndex = (n + totalSlides) % totalSlides;
        slides[slideIndex].classList.add('ativo');
        bolinhas[slideIndex].classList.add('ativo');
    }

    window.mudarSlide = function(n) {
        clearInterval(autoSlideInterval);
        mostrarSlide(slideIndex + n);
        iniciarAutoSlide();
    }

    window.irParaSlide = function(n) {
        clearInterval(autoSlideInterval);
        mostrarSlide(n);
        iniciarAutoSlide();
    }

    function iniciarAutoSlide() {
        autoSlideInterval = setInterval(() => mudarSlide(1), autoSlideDelay);
    }

    if (slides.length > 0) {
        iniciarAutoSlide();
        mostrarSlide(slideIndex);
    }

    // --- CATÁLOGO ---
    const categoriaBotoes = document.querySelectorAll('.categoria-botao');
    const catalogoSessoes = document.querySelectorAll('.catalogo-sessao');

    categoriaBotoes.forEach(botao => {
        botao.addEventListener('click', function() {
            const categoria = this.dataset.categoria;
            const sessaoAtiva = document.getElementById(`catalogo-${categoria}`);

            catalogoSessoes.forEach(sessao => {
                if (sessao.id !== sessaoAtiva.id) {
                    sessao.style.display = 'none';
                }
            });

            if (sessaoAtiva.style.display === 'block') {
                sessaoAtiva.style.display = 'none';
            } else {
                sessaoAtiva.style.display = 'block';
            }
            categoriaBotoes.forEach(btn => btn.classList.remove('ativo'));
            this.classList.add('ativo');
        });
    });

    catalogoSessoes.forEach((sessao, index) => {
        if (index > 0) {
            sessao.style.display = 'none';
        }
    });

    // Truncar descrição no catálogo e adicionar "Ver mais..."
    const descricoesBreves = document.querySelectorAll('.hover-info .descricao');
    descricoesBreves.forEach(descricao => {
        const textoOriginal = descricao.textContent.trim();
        if (textoOriginal.length > 15) {
            const textoTruncado = textoOriginal.substring(0, 15) + "...";
            descricao.textContent = textoTruncado;
            const verMaisSpan = document.createElement('span');
            verMaisSpan.classList.add('ver-mais');
            verMaisSpan.textContent = 'ver mais';
            descricao.appendChild(verMaisSpan);
        }
    });

    // --- MODAL DE PRODUTO ---
    const produtoImagens = document.querySelectorAll('.imagem-container');
    const modalProduto = document.getElementById('modal-produto');
    const imagemAmpliada = document.getElementById('imagem-ampliada');
    const nomeProdutoModal = document.getElementById('nome-produto-modal');
    const descricaoProdutoModal = document.getElementById('descricao-produto-modal');
    const precoProdutoModal = document.getElementById('preco-produto-modal');
    const fecharModal = document.querySelector('.fechar-modal');
    const adicionarDoModal = document.getElementById('adicionar-do-modal');
    let produtoAtualModal = null;

    produtoImagens.forEach(container => {
        container.addEventListener('click', function() {
            const produtoDiv = this.closest('.produto');
            const nome = produtoDiv.dataset.nome;
            const preco = produtoDiv.dataset.preco;
            const descricaoCompleta = produtoDiv.dataset.descricaoCompleta; // Pega do atributo data-descricao-completa
            const imagemSrc = this.querySelector('img').src;
            produtoAtualModal = { id: produtoDiv.dataset.id, nome: nome, preco: preco, imagem: imagemSrc };

            imagemAmpliada.src = imagemSrc;
            nomeProdutoModal.textContent = nome;
            descricaoProdutoModal.textContent = descricaoCompleta; // Exibe a descrição completa no modal
            precoProdutoModal.textContent = `R$ ${preco}`;
            modalProduto.style.display = 'block';
        });
    });

    fecharModal.addEventListener('click', () => {
        modalProduto.style.display = 'none';
        produtoAtualModal = null;
    });

    window.addEventListener('click', event => {
        if (event.target === modalProduto) {
            modalProduto.style.display = 'none';
            produtoAtualModal = null;
        }
    });

    adicionarDoModal.addEventListener('click', () => {
        if (produtoAtualModal) {
            adicionarAoCarrinho(produtoAtualModal.id, produtoAtualModal.nome, produtoAtualModal.preco, produtoAtualModal.imagem);
            modalProduto.style.display = 'none';
            produtoAtualModal = null;
        }
    });

    // --- CARRINHO DE COMPRAS ---
    const adicionarAoCarrinhoButtons = document.querySelectorAll('.adicionar-carrinho');
    const listaCarrinho = document.getElementById('lista-carrinho');
    const totalCarrinhoElement = document.getElementById('total-carrinho');
    const carrinhoVazioElement = document.getElementById('carrinho-vazio');
    const carrinhoQuantidadeFlutuante = document.getElementById('carrinho-quantidade-flutuante');
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    function atualizarCarrinhoUI() {
        listaCarrinho.innerHTML = '';
        let total = 0;
        let quantidadeTotal = 0;

        if (carrinho.length === 0) {
            carrinhoVazioElement.style.display = 'block';
        } else {
            carrinhoVazioElement.style.display = 'none';
            carrinho.forEach(item => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <img src="${item.imagem}" alt="${item.nome}">
                    <div class="item-info">
                        <h4>${item.nome}</h4>
                        <div class="quantidade-controle">
                            <button class="decrementar" data-id="${item.id}">-</button>
                            <span>${item.quantidade}</span>
                            <button class="incrementar" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <span class="item-preco">R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
                    <button class="remover-item" data-id="${item.id}"><i class="fas fa-trash-alt"></i> Remover</button>
                `;
                listaCarrinho.appendChild(listItem);
                total += item.preco * item.quantidade;
                quantidadeTotal += item.quantidade;
            });
        }

        totalCarrinhoElement.textContent = `Total: R$ ${total.toFixed(2)}`;
        carrinhoQuantidadeFlutuante.textContent = quantidadeTotal;
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
    }

    function adicionarAoCarrinho(id, nome, preco, imagemSrc) {
        const itemExistente = carrinho.find(item => item.id === id);
        if (itemExistente) {
            itemExistente.quantidade++;
        } else {
            carrinho.push({ id: id, nome: nome, preco: parseFloat(preco), quantidade: 1, imagem: imagemSrc });
        }
        atualizarCarrinhoUI();
        mostrarNotificacao('Produto adicionado ao carrinho!', 'success');
    }

    adicionarAoCarrinhoButtons.forEach(button => {
        button.addEventListener('click', function() {
            const produtoDiv = this.closest('.produto');
            const id = produtoDiv.dataset.id;
            const nome = produtoDiv.dataset.nome;
            const preco = produtoDiv.dataset.preco;
            const imagemSrc = produtoDiv.querySelector('img').src;
            adicionarAoCarrinho(id, nome, preco, imagemSrc);
        });
    });

    listaCarrinho.addEventListener('click', function(event) {
        if (event.target.classList.contains('incrementar')) {
            const id = event.target.dataset.id;
            const item = carrinho.find(item => item.id === id);
            if (item) {
                item.quantidade++;
                atualizarCarrinhoUI();
                mostrarNotificacao('Quantidade aumentada!', 'atualizado');
            }
        } else if (event.target.classList.contains('decrementar')) {
            const id = event.target.dataset.id;
            const item = carrinho.find(item => item.id === id);
            if (item) {
                item.quantidade--;
                if (item.quantidade <= 0) {
                    carrinho = carrinho.filter(i => i.id !== id);
                    mostrarNotificacao('Produto removido do carrinho!', 'removido');
                } else {
                    mostrarNotificacao('Quantidade diminuída!', 'removido');
                }
                atualizarCarrinhoUI();
            }
        } else if (event.target.classList.contains('remover-item')) {
            const id = event.target.dataset.id;
            carrinho = carrinho.filter(item => item.id !== id);
            atualizarCarrinhoUI();
            mostrarNotificacao('Produto removido do carrinho!', 'removido');
        }
    });

    // --- CARRINHO FLUTUANTE ---
    const mostrarCarrinhoFlutuanteButton = document.getElementById('mostrar-carrinho-flutuante');
    const carrinhoContainer = document.getElementById('carrinho-container');
    const fecharCarrinhoButton = document.getElementById('fechar-carrinho');

    mostrarCarrinhoFlutuanteButton.addEventListener('click', function(event) {
        event.preventDefault();
        carrinhoContainer.classList.add('aberto');
    });

    fecharCarrinhoButton.addEventListener('click', () => carrinhoContainer.classList.remove('aberto'));

    // --- NOTIFICAÇÕES ---
    const notificacaoContainer = document.getElementById('notificacao-container');

    function mostrarNotificacao(mensagem, tipo = 'info') {
        const notificacao = document.createElement('div');
        notificacao.classList.add('notificacao', tipo);
        notificacao.textContent = mensagem;
        notificacaoContainer.appendChild(notificacao);

        setTimeout(() => {
            notificacao.classList.add('removido');
            setTimeout(() => notificacao.remove(), 300);
        }, 3000);
    }

    // --- SELEÇÃO DE FORMA DE PAGAMENTO ---
    const opcoesPagamento = document.querySelectorAll('.opcao-pagamento');

    opcoesPagamento.forEach(opcao => {
        opcao.addEventListener('click', function() {
            opcoesPagamento.forEach(outraOpcao => {
                if (outraOpcao !== this) {
                    outraOpcao.classList.remove('selecionado');
                }
            });
            this.classList.toggle('selecionado');
        });
    });

    // --- FINALIZAR COMPRA VIA WHATSAPP ---
    const finalizarWhatsappBtn = document.getElementById('finalizar-whatsapp');

    finalizarWhatsappBtn.addEventListener('click', function() {
        let mensagem = "*Pedido de Compra*\n\n";
        let total = 0;
        const itensCarrinho = document.querySelectorAll('#lista-carrinho li'); // Usando a lista renderizada

        if (itensCarrinho.length === 0) {
            alert("O carrinho está vazio. Adicione itens para finalizar a compra.");
            return;
        }

        itensCarrinho.forEach(itemLi => {
            const nome = itemLi.querySelector('.item-info h4').textContent;
            const precoTexto = itemLi.querySelector('.item-preco').textContent;
            const preco = parseFloat(precoTexto.replace('R$', '').replace(',', '.').trim());
            const quantidadeElement = itemLi.querySelector('.quantidade-controle span');
            const quantidade = parseInt(quantidadeElement.textContent);
            const subtotal = preco * quantidade;
            total += subtotal;
            mensagem += `- ${quantidade} x ${nome} = R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
        });

        mensagem += `\n*Total:* R$ ${total.toFixed(2).replace('.', ',')}\n\n`;

        const formaPagamentoSelecionada = document.querySelector('.opcao-pagamento.selecionado');
        if (formaPagamentoSelecionada) {
            mensagem += `*Forma de Pagamento:* ${formaPagamentoSelecionada.textContent.trim()}\n`;
        } else {
            mensagem += "*Forma de Pagamento:* Não selecionada\n";
        }

        const numeroVendedor = '41984323949'; // Substitua pelo seu número
        const linkWhatsapp = `https://wa.me/${numeroVendedor}?text=${encodeURIComponent(mensagem)}`;
        window.open(linkWhatsapp, '_blank');
    });

    // Inicializar o carrinho ao carregar a página
    atualizarCarrinhoUI();
});