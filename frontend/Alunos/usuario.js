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

    listaJogos.forEach((jogo) => {
        const cardJogo = document.createElement('div');
        const nomeJogo = document.createElement('h3');
        nomeJogo.innerText = jogo.nome;
        cardJogo.appendChild(nomeJogo);
        const precoJogo = document.createElement('p');
        precoJogo.innerText = jogo.preco;
        cardJogo.appendChild(precoJogo);
        cardJogo.classList.add('card-aluno');
        album.appendChild(cardJogo);
    });
};

criarNav('alunos');
renderJogos();
