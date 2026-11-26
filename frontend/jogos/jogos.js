import { criarNav } from "../BarraNav/barraNav.js";

const API_URL = "http://localhost:3000";

const fetchJogos = async (token) => {
    const resposta = await fetch(`${API_URL}/jogos`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
    const listaJogos = await resposta.json();

    return listaJogos;
};

const comprarJogo = async (id, token) => {
    try {
        const resposta = await fetch(`${API_URL}/jogos/${id}/comprar`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const dados = await resposta.json().catch(() => ({}));
        return { status: resposta.status, dados };
    } catch (err) {
        return { status: 0, erro: err.message };
    }
};

const renderJogos = async () => {
    const token = localStorage.getItem('token');
    let listaJogos;

    try {
        listaJogos = await fetchJogos(token);
    } catch (err) {
        alert('Não foi possível carregar os jogos. Tente novamente!');
        return;
    }

    if (listaJogos.erro) {
        alert('Sessão expirada, faça login novamente!');
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        location.href = '/';
        return;
    }

    const album = document.querySelector('#album');

    // Limpa o álbum antes de renderizar
    album.innerHTML = '';

    listaJogos.forEach((jogo) => {
        const cardJogo = document.createElement('div');
        cardJogo.classList.add('card-aluno');

        const nomeJogo = document.createElement('h3');
        nomeJogo.innerText = jogo.nome;
        cardJogo.appendChild(nomeJogo);

        const precoJogo = document.createElement('p');
        precoJogo.innerText = `R$ ${jogo.preco}`;
        cardJogo.appendChild(precoJogo);

        const btnComprar = document.createElement('button');
        btnComprar.innerText = "Comprar";
        btnComprar.style.marginTop = "0.5em";
        btnComprar.style.padding = "0.3em 0.5em";
        btnComprar.style.cursor = "pointer";

        // Evento de compra
        btnComprar.onclick = async () => {
            const result = await comprarJogo(jogo._id, token);
            if (result.status === 201) {
                alert(result.dados || "Jogo comprado com sucesso!");
                // Remove o botão após compra bem-sucedida
                btnComprar.style.display = "none";
                btnComprar.innerText = "Comprou!";
            } else if (result.erro && result.erro.includes("já comprou")) {
                alert(result.erro || "Você já comprou este jogo!");
                btnComprar.innerText = "Comprou!";
                btnComprar.style.color = "gray";
            } else {
                alert(result.dados?.mensagem || "Não foi possível completar a compra. Tente novamente.");
            }
        };

        cardJogo.appendChild(btnComprar);
        album.appendChild(cardJogo);
    });
};

criarNav('jogos');
renderJogos();