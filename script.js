// 1. Matriz/Grafo da História (Estrutura de Dados das Cenas)
const historia = {
    inicio: {
        texto: "Você está na entrada de uma floresta escura e nebulosa. O vento uiva entre as árvores.",
        escolhas: [
            { texto: "Entrar na floresta caminhando", proximaCena: "floresta" },
            { texto: "Seguir o caminho ao redor da floresta", proximaCena: "caminhoSeguro" }
        ]
    },
    floresta: {
        texto: "Ao se aprofundar, você ouve um rosnado alto. Um lobo gigante aparece diante de você!",
        escolhas: [
            { texto: "Lutar com sua espada", proximaCena: "derrotaLobo" },
            { texto: "Subir em uma árvore rapidamente", proximaCena: "arvore" }
        ]
    },
    caminhoSeguro: {
        texto: "Você caminha em segurança até encontrar um baú de tesouro abandonado na beira da estrada.",
        escolhas: [
            { texto: "Abrir o baú", proximaCena: "vitoriaBau" },
            { texto: "Ignorar e continuar andando", proximaCena: "fimCaminho" }
        ]
    },
    derrotaLobo: {
        texto: "O lobo era forte demais! Você foi derrotado. Fim de jogo.",
        escolhas: [
            { texto: "Tentar Novamente", proximaCena: "inicio" }
        ]
    },
    arvore: {
        texto: "Do alto da árvore, você vê o lobo ir embora e enxerga uma saída para a floresta! Você sobreviveu. Vitória!",
        escolhas: [
            { texto: "Jogar Novamente", proximaCena: "inicio" }
        ]
    },
    vitoriaBau: {
        texto: "O baú estava cheio de moedas de ouro e gemas preciosas! Você ficou rico. Vitória!",
        escolhas: [
            { texto: "Jogar Novamente", proximaCena: "inicio" }
        ]
    },
    fimCaminho: {
        texto: "Você caminhou por horas, mas a estrada não levava a lugar nenhum. Você se cansou. Fim de jogo.",
        escolhas: [
            { texto: "Tentar Novamente", proximaCena: "inicio" }
        ]
    }
};

// 2. Elementos do DOM (Document Object Model)
const storyTextElement = document.getElementById("story-text");
const choicesContainerElement = document.getElementById("choices-container");

// 3. Algoritmo de Transição de Cena (Função principal)
function mostrarCena(chaveCena) {
    const cenaAtual = historia[chaveCena];

    // Atualiza o texto da história
    storyTextElement.textContent = cenaAtual.texto;

    // Limpa os botões da cena anterior
    choicesContainerElement.innerHTML = "";

    // Para cada escolha disponível na cena, gera um botão
    cenaAtual.escolhas.forEach(escolha => {
        const button = document.createElement("button");
        button.textContent = escolha.texto;
        
        // Evento de clique que executa o algoritmo para ir à próxima cena
        button.onclick = () => mostrarCena(escolha.proximaCena);

        choicesContainerElement.appendChild(button);
    });
}

// 4. Início do Jogo
mostrarCena("inicio");