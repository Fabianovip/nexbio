import { auth } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";


// ================================
// MANTER LOGIN NO CELULAR
// ================================

async function manterSessao() {

  await setPersistence(
    auth,
    browserLocalPersistence
  );

}


// ================================
// CADASTRO
// ================================

const btnCadastro =
  document.getElementById("btnCadastro");


if (btnCadastro) {

  btnCadastro.addEventListener(
    "click",
    async () => {

      const nome =
        document.getElementById("nome").value;

      const email =
        document.getElementById("novoEmail").value;

      const senha =
        document.getElementById("novaSenha").value;


      try {

        await manterSessao();


        await createUserWithEmailAndPassword(
          auth,
          email,
          senha
        );


        alert(
          "Conta criada com sucesso! 🚀"
        );


      } catch (erro) {

        alert(
          "Erro: " + erro.message
        );

      }

    }
  );

}


// ================================
// LOGIN
// ================================

const btnLogin =
  document.getElementById("btnLogin");


if (btnLogin) {

  btnLogin.addEventListener(
    "click",
    async () => {

      const email =
        document.getElementById("email").value;

      const senha =
        document.getElementById("senha").value;


      try {

        await manterSessao();


        await signInWithEmailAndPassword(
          auth,
          email,
          senha
        );


        alert(
          "Login realizado! 🚀"
        );


        window.location.href =
          "painel.html";


      } catch (erro) {

        alert(
          "Erro: " + erro.message
        );

      }

    }
  );

}