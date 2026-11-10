
const API_URL = "http://localhost:3000";

// ---------- Elementos ----------
const loginView = document.getElementById("login-view");
const welcomeView = document.getElementById("welcome-view");
const registerView = document.getElementById("register-view");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const loginButton = document.getElementById("login-button");
const loginButtonText = document.getElementById("login-button-text");
const loginSpinner = document.getElementById("login-spinner");
const togglePassword = document.getElementById("toggle-password");
const linkToRegister = document.getElementById("link-to-register");
const linkToLogin = document.getElementById("link-to-login");

const welcomeName = document.getElementById("welcome-name");
const welcomeMessage = document.getElementById("welcome-message");
const welcomeType = document.getElementById("welcome-type");
const logoutBtn = document.getElementById("logout-btn");

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
let authenticatedUser = null;

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

    if (!response.ok) {
      throw new Error(data.message || data.error || "E-mail ou senha inválidos.");
    }

    const user = data.user || data;
    authenticatedUser = user;
    showWelcome(user);
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
      throw new Error(data.message || data.error || "Não foi possível criar a conta.");
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

// ---------- Welcome ----------
function getWelcomeMessage(user) {
  const type = String(user.type || "user").toLowerCase();

  if (type === "admin") {
    return `Bem-vindo, ${user.name}! Sua conta possui acesso administrativo ao sistema.`;
  }

  if (type === "user") {
    return `Bem-vindo, ${user.name}! Obrigado por acessar o sistema.`;
  }

  return `Bem-vindo, ${user.name}! Estamos felizes em tê-lo conosco.`;
}

function showWelcome(user) {
  // textContent evita problemas de HTML nos dados vindos do backend
  welcomeName.textContent = user.name || "";
  welcomeMessage.textContent = getWelcomeMessage(user);
  welcomeType.textContent = String(user.type || "user").toUpperCase();

  loginView.hidden = true;
  welcomeView.hidden = false;
}

function showLogin() {
  welcomeView.hidden = true;
  loginView.hidden = false;
  registerView.hidden = true;
}

function showRegister() {
  loginView.hidden = true;
  registerView.hidden = false;
}

// ---------- Logout ----------
logoutBtn.addEventListener("click", () => {
  authenticatedUser = null;
  emailInput.value = "";
  passwordInput.value = "";
  setPasswordVisible(false);
  loginError.hidden = true;
  registerError.hidden = true;
  registerSuccess.hidden = true;
  showLogin();
});

// ---------- Inicialização ----------
showLogin();
