export const criarNav = (pagina) => {
    const btSair = document.createElement('button');
    btSair.innerText = 'Sair';
    btSair.onclick = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        location.href = '/';
    };
    const barraNav = document.querySelector('nav');
    barraNav.appendChild(btSair);

    const admin = localStorage.getItem('admin');

    if (admin === 'true') {
        const novoBt = document.createElement('button');
        novoBt.innerText = pagina === 'usuarios' ?
        'Album de Alunos' : 
        'Lista de Usuários';
        novoBt.onclick = () => {
            location.href = pagina === 'usuarios' ?
            '/Alunos/alunos.html' :
            '/Usuarios/usuarios.html';
        };
        barraNav.appendChild(novoBt);
    }
}
