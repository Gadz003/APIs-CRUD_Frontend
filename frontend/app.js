
const API_URL = "http://localhost:3000";


const loginView = document.getElementById("login-view");
const welcomeView = document.getElementById("welcome-view");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const loginButton = document.getElementById("login-button");
const loginButtonText = document.getElementById("login-button-text");
const loginSpinner = document.getElementById("login-spinner");
const togglePassword = document.getElementById("toggle-password");

const welcomeName = document.getElementById("welcome-name");
const welcomeMessage = document.getElementById("welcome-message");
const welcomeType = document.getElementById("welcome-type");
const logoutBtn = document.getElementById("logout-btn");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const iconEye = document.getElementById("icon-eye");
const iconEyeOff = document.getElementById("icon-eye-off");


let authenticatedUser = null;


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
    const response = await fetch(`${API_URL}/auth/login`, {
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
  welcomeName.textContent = user.name || "";
  welcomeMessage.textContent = getWelcomeMessage(user);
  welcomeType.textContent = String(user.type || "user").toUpperCase();

  loginView.hidden = true;
  welcomeView.hidden = false;
}

function showLogin() {
  welcomeView.hidden = true;
  loginView.hidden = false;
}


logoutBtn.addEventListener("click", () => {
  authenticatedUser = null;
  emailInput.value = "";
  passwordInput.value = "";
  setPasswordVisible(false);
  loginError.hidden = true;
  showLogin();
});


showLogin();
