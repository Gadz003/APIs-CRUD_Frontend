import { criarNav } from "../BarraNav/barraNav.js";

const API_URL = "http://localhost:3000";

const fetchAlunos = async (token) => {
    const resposta = await fetch(`${API_URL}/alunos`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
    const listaAlunos = await resposta.json();

    return listaAlunos;
};

const renderAlunos = async () => {
    const token = localStorage.getItem('token');
    let listaAlunos;

    try {
        listaAlunos = await fetchAlunos(token);
    } catch (err) {
        alert('Não foi possível carregar os alunos. Tente novamente!');
        return;
    }

    if (listaAlunos.erro) {
        alert('Sessão expirada, faça login novamente!')
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        location.href = '/';
        return;
    }

    const album = document.querySelector('#album');

    listaAlunos.forEach((aluno) => {
        const cardAluno = document.createElement('div');
        const nomeAluno = document.createElement('h3');
        nomeAluno.innerText = aluno.nome;
        cardAluno.appendChild(nomeAluno);
        const emailAluno = document.createElement('p');
        emailAluno.innerText = aluno.email;
        cardAluno.appendChild(emailAluno);
        cardAluno.classList.add('card-aluno');
        album.appendChild(cardAluno);
    });
}

criarNav('alunos')
renderAlunos();
