const API_URL = "http://localhost:3000";

// ---------- Elementos ----------
const loginView = document.getElementById("login-view");
const registerView = document.getElementById("register-view");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const loginButton = document.getElementById("login-button");
const loginButtonText = document.getElementById("login-button-text");
const loginSpinner = document.getElementById("login-spinner");
const togglePassword = document.getElementById("toggle-password");
const linkToRegister = document.getElementById("link-to-register");
const linkToLogin = document.getElementById("link-to-login");

const registerForm = document.getElementById("register-form");
const registerError = document.getElementById("register-error");
const registerSuccess = document.getElementById("register-success");
const registerButton = document.getElementById("register-button");
const registerButtonText = document.getElementById("register-button-text");
const registerSpinner = document.getElementById("register-spinner");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const iconEye = document.getElementById("icon-eye");
const iconEyeOff = document.getElementById("icon-eye-off");

// ---------- Estado ----------
const TOKEN_KEY = "token";
const ADMIN_KEY = "admin";

// ---------- Toggle de senha ----------
function syncToggleIcons(isText) {
  iconEye.classList.toggle("hidden", isText);
  iconEyeOff.classList.toggle("hidden", !isText);
}

function setPasswordVisible(visible) {
  passwordInput.type = visible ? "text" : "password";
  syncToggleIcons(visible);
}

togglePassword.addEventListener("click", () => {
  setPasswordVisible(passwordInput.type === "password");
});

// ---------- Navegação entre telas ----------
linkToRegister.addEventListener("click", (event) => {
  event.preventDefault();
  registerError.hidden = true;
  registerSuccess.hidden = true;
  showRegister();
});

linkToLogin.addEventListener("click", (event) => {
  event.preventDefault();
  loginError.hidden = true;
  showLogin();
});

// ---------- Login ----------
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginError.hidden = true;

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    loginError.textContent = "Informe seu e-mail e senha para continuar.";
    loginError.hidden = false;
    return;
  }

  loginButton.disabled = true;
  loginButtonText.textContent = "Entrando...";
  loginSpinner.hidden = false;

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json().catch(() => ({}));
    const mensagem = data.mensagem || data.message || "";

    if (mensagem.toLowerCase().includes("desativado")) {
      loginError.textContent = mensagem;
      loginError.hidden = false;
      return;
    }

    if (!response.ok) {
      throw new Error(mensagem || "E-mail ou senha inválidos.");
    }

    const token = data.token;
    const user = data.user || data;
    const admin = data.admin ?? user?.type === "admin";

    if (!token) {
      throw new Error("Não foi possível iniciar a sessão. Tente novamente.");
    }

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ADMIN_KEY, String(admin));

    location.href = "/Alunos/alunos.html";
  } catch (err) {
    loginError.textContent = err.message || "Não foi possível conectar ao servidor. Tente novamente.";
    loginError.hidden = false;
  } finally {
    loginButton.disabled = false;
    loginButtonText.textContent = "Entrar";
    loginSpinner.hidden = true;
  }
});

// ---------- Cadastro ----------
registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  registerError.hidden = true;
  registerSuccess.hidden = true;

  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-password").value;
  const confirmPassword = document.getElementById("reg-confirm").value;

  if (!name || !email || !password) {
    registerError.textContent = "Preencha todos os campos.";
    registerError.hidden = false;
    return;
  }

  if (password.length < 6) {
    registerError.textContent = "A senha deve ter pelo menos 6 caracteres.";
    registerError.hidden = false;
    return;
  }

  if (password !== confirmPassword) {
    registerError.textContent = "As senhas não coincidem.";
    registerError.hidden = false;
    return;
  }

  registerButton.disabled = true;
  registerButtonText.textContent = "Criando...";
  registerSpinner.hidden = false;

  try {
    const response = await fetch(`${API_URL}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.mensagem || data.message || "Não foi possível criar a conta.");
    }

    registerSuccess.textContent = "Conta criada com sucesso! Faça login.";
    registerSuccess.hidden = false;
  } catch (err) {
    registerError.textContent = err.message || "Não foi possível criar a conta.";
    registerError.hidden = false;
  } finally {
    registerButton.disabled = false;
    registerButtonText.textContent = "Criar conta";
    registerSpinner.hidden = true;
  }
});

// ---------- Telas ----------
function showLogin() {
  registerView.hidden = true;
  loginView.hidden = false;
}

function showRegister() {
  loginView.hidden = true;
  registerView.hidden = false;
}

// ---------- Sessão ----------
const token = localStorage.getItem(TOKEN_KEY);
if (token) {
  location.href = "/Alunos/alunos.html";
} else {
  showLogin();
}
