import { criarNav } from "../BarraNav/barraNav.js";

const API_URL = "http://localhost:3000";

const fetchUsuarios = async (token) => {
    const resposta = await fetch(`${API_URL}/usuarios`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    const listaUsuarios = await resposta.json();

    return listaUsuarios;
};

const renderUsuarios = async () => {
    const token = localStorage.getItem('token');
    let listaUsuarios;

    try {
        listaUsuarios = await fetchUsuarios(token);
    } catch (err) {
        alert('Não foi possível carregar os usuários. Tente novamente!');
        return;
    }

    if (listaUsuarios.erro) {
        alert('Sessão expirada, faça login novamente!');
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        location.href = '/';
        return;
    }

    const lista = document.querySelector('#usuarios');

    listaUsuarios.forEach((usuario) => {
        const item = document.createElement('div');
        const email = document.createElement('span');
        email.innerText = usuario.email;
        item.appendChild(email);
        const status = document.createElement('span');
        status.innerText = usuario.status ?? (usuario.ativo === false ? 'Inativo' : 'Ativo');
        item.appendChild(status);
        lista.appendChild(item);
    });
};

criarNav('usuarios');
renderUsuarios();
