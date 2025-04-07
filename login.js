function finalizarInscricao() {
    const id = document.getElementById('usuario-id').value.trim();
    const senha = document.getElementById('usuario-senha').value.trim();
    const termosAceitos = document.getElementById('termos').checked;
  
    if (!id || !senha) {
      alert("Por favor, preencha o ID e a senha.");
      return;
    }
  
    if (!termosAceitos) {
      alert("Você deve aceitar os termos e condições para continuar.");
      return;
    }
  
    localStorage.setItem('userId', id);
    localStorage.setItem('userSenha', senha);
  
    window.location.href = './login.html';
}
  
document.addEventListener('DOMContentLoaded', () => {
const formLogin = document.getElementById('login-form');
  
if (formLogin) {
    formLogin.addEventListener('submit', function (event) {
    event.preventDefault();
  
    const loginId = document.getElementById('login-id').value.trim();
    const loginSenha = document.getElementById('login-senha').value.trim();
  
    const savedId = localStorage.getItem('userId');
    const savedSenha = localStorage.getItem('userSenha');
  
    if (loginId === savedId && loginSenha === savedSenha) {
        window.location.href = './sucesso.html';
    } else {
        alert('ID ou senha incorretos. Tente novamente.');
    }
    });
}
});
  