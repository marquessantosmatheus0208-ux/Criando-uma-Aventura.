// Estado global do jogador
let vida = 100;
let inventario = [];

// URLs de imagens de referência (placeholders ilustrativos de alta qualidade)
const imagens = {
    floresta: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800",
    castelo: "https://images.unsplash.com/photo-1585543805890-6051f7829f98?w=800",
    bau: "https://images.unsplash.com/photo-1563089145-599997674d42?w=800",
    combate: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800",
    vitoria: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800",
    derrota: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800"
};

// Grafo de cenas da aventura
const historia = {
    inicio: {
        texto: "Você acorda na entrada de uma floresta densa. Ao seu lado, há duas rotas: um caminho escuro entre as árvores e uma trilha de pedra que leva a um castelo distante.",
        imagem: imagens.floresta,
        escolhas: [
            { texto: "Entrar na floresta densa", proximaCena: "florestaEntrada" },
            { texto: "Seguir a trilha de pedra até o castelo", proximaCena: "casteloEntrada" }
        ]
    },
    florestaEntrada: {
        texto: "Caminhando entre as árvores, você encontra um esqueleto de cavaleiro segurando uma poção brilhante e uma espada enferrujada.",
        imagem: imagens.floresta,
        escolhas: [
            { 
                texto: "Pegar a poção (+20 Vida)", 
                proximaCena: "florestaAprofundada", 
                acao: () => { vida = Math.min(100, vida + 20); } 
            },
            { 
                texto: "Pegar a espada enferrujada", 
                proximaCena: "florestaAprofundada", 
                acao: () => { adicionarItem("Espada Enferrujada"); } 
            },
            { texto: "Ignorar e continuar andando", proximaCena: "florestaAprofundada" }
        ]
    },
    florestaAprofundada: {
        texto: "De repente, um goblin furioso salta das moitas com uma clava!",
        imagem: imagens.combate,
        escolhas: [
            { 
                texto: "Lutar contra o goblin", 
                proximaCena: "resultadoLutaGoblin" 
            },
            { 
                texto: "Fugir para o pátio do castelo (-15 Vida)", 
                proximaCena: "casteloEntrada",
                acao: () => { vida -= 15; }
            }
        ]
    },
    resultadoLutaGoblin: {
        texto: "", // Gerado dinamicamente no algoritmo
        imagem: imagens.combate,
        dinamico: () => {
            if (inventario.includes("Espada Enferrujada")) {
                return {
                    texto: "Graças à espada que você pegou, você derrota o goblin com facilidade e encontra a chave do castelo no bolso dele!",
                    acao: () => { adicionarItem("Chave Dourada"); },
                    escolhas: [{ texto: "Avançar para o castelo", proximaCena: "casteloEntrada" }]
                };
            } else {
                vida -= 40;
                return {
                    texto: "Você luta de mãos vazias e sofre bastante dano (-40 Vida), mas consegue nocautear o goblin e correr até o castelo.",
                    escolhas: [{ texto: "Correr para o castelo", proximaCena: "casteloEntrada" }]
                };
            }
        }
    },
    casteloEntrada: {
        texto: "Você está diante do portão do castelo abandonado. O portão principal está trancado por um grande cadeado dourado.",
        imagem: imagens.castelo,
        escolhas: [
            { texto: "Usar a Chave Dourada no portão", proximaCena: "salaTesouro", requerItem: "Chave Dourada" },
            { texto: "Tentar arrombar a porta lateral a pontapés (-10 Vida)", proximaCena: "salaTesouro", acao: () => { vida -= 10; } },
            { texto: "Voltar para a floresta", proximaCena: "florestaEntrada" }
        ]
    },
    salaTesouro: {
        texto: "Dentro do castelo, você encontra uma sala iluminada por tochas com um baú de tesouro ancestral no centro.",
        imagem: imagens.bau,
        escolhas: [
            { texto: "Abrir o baú", proximaCena: "vitoria" },
            { texto: "Examinar as paredes antes de mexer no baú", proximaCena: "armadilhaEvitada" }
        ]
    },
    armadilhaEvitada: {
        texto: "Você nota um fio de nylon no chão conectado a dardos venenosos! Desarmando a armadilha com cuidado, você abre o baú com total segurança.",
        imagem: imagens.bau,
        escolhas: [
            { texto: "Coletar o tesouro real", proximaCena: "vitoria" }
        ]
    },
    vitoria: {
        texto: "Parabéns! O baú continha a Coroa Perdida do Reino. Você concluiu sua aventura com sucesso!",
        imagem: imagens.vitoria,
        escolhas: [
            { texto: "Jogar Novamente", proximaCena: "inicio", reiniciar: true }
        ]
    },
    derrota: {
        texto: "Sua vida chegou a zero. Suas forças se esgotaram e a jornada termina aqui...",
        imagem: imagens.derrota,
        escolhas: [
            { texto: "Tentar Novamente", proximaCena: "inicio", reiniciar: true }
        ]
    }
};

// Elementos do DOM
const storyTextElement = document.getElementById("story-text");
const choicesContainerElement = document.getElementById("choices-container");
const sceneImageElement = document.getElementById("scene-image");
const healthElement = document.getElementById("health-val");
const inventoryElement = document.getElementById("inventory-val");

function adicionarItem(item) {
    if (!inventario.includes(item)) {
        inventario.push(item);
    }
}

function atualizarStatus() {
    healthElement.textContent = vida;
    inventoryElement.textContent = inventario.length > 0 ? inventario.join(", ") : "Vazio";
}

function mostrarCena(chaveCena) {
    // Verificação de derrota por vida zerada
    if (vida <= 0 && chaveCena !== "derrota") {
        mostrarCena("derrota");
        return;
    }

    let cenaAtual = historia[chaveCena];

    // Trata cenas com lógica condicional/dinâmica
    if (cenaAtual.dinamico) {
        const dadosDinamicos = cenaAtual.dinamico();
        if (dadosDinamicos.acao) dadosDinamicos.acao();
        cenaAtual = { ...cenaAtual, ...dadosDinamicos };
    }

    // Atualiza interface
    storyTextElement.textContent = cenaAtual.texto;
    sceneImageElement.src = cenaAtual.imagem;
    choicesContainerElement.innerHTML = "";
    atualizarStatus();

    // Renderiza escolhas disponíveis
    cenaAtual.escolhas.forEach(escolha => {
        // Bloqueia escolhas que exigem itens que o jogador não possui
        if (escolha.requerItem && !inventario.includes(escolha.requerItem)) {
            return; 
        }

        const button = document.createElement("button");
        button.textContent = escolha.texto;
        
        button.onclick = () => {
            if (escolha.reiniciar) {
                vida = 100;
                inventario = [];
            }
            if (escolha.acao) {
                escolha.acao();
            }
            mostrarCena(escolha.proximaCena);
        };

        choicesContainerElement.appendChild(button);
    });
}

// Inicia o jogo
mostrarCena("inicio");