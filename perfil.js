import { db } from "./firebase.js";

import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


const parametros =
  new URLSearchParams(window.location.search);

const usuarioId =
  parametros.get("uid");


async function carregarPerfil() {

  if (!usuarioId) {

    document.getElementById("nomePerfil").textContent =
      "Perfil não encontrado";

    return;
  }


  try {

    // =========================
    // PERFIL
    // =========================

    const perfilRef =
      doc(db, "usuarios", usuarioId);

    const perfilSnap =
      await getDoc(perfilRef);


    if (!perfilSnap.exists()) {

      document.getElementById("nomePerfil").textContent =
        "Perfil não encontrado";

      return;
    }


    const dados =
      perfilSnap.data();


    document.getElementById("nomePerfil").textContent =
      dados.nome || "Sem nome";


    document.getElementById("usuarioPerfil").textContent =
      "@" + (dados.usuario || "usuario");


    document.getElementById("bioPerfil").textContent =
      dados.bio || "Sem biografia";


    // =========================
    // FOTO DE PERFIL
    // =========================

    const foto =
      document.getElementById("fotoPerfil");


    if (foto && dados.fotoPerfil) {

      foto.src =
        dados.fotoPerfil;

    }


    // =========================
    // BANNER
    // =========================

    const banner =
      document.querySelector(".banner");


    if (banner && dados.banner) {

      banner.style.backgroundImage =
        `url("${dados.banner}")`;

      banner.style.backgroundSize =
        "cover";

      banner.style.backgroundPosition =
        "center";

    }


    // =========================
    // LINKS
    // =========================

    const lista =
      document.getElementById("listaLinks");


    lista.innerHTML = "";


    const consulta =
      query(
        collection(db, "links"),
        where("usuarioId", "==", usuarioId)
      );


    const resultado =
      await getDocs(consulta);


    resultado.forEach((documento) => {

      const link =
        documento.data();


      if (!link.url) return;


      const botao =
        document.createElement("a");


      botao.href =
        link.url;


      botao.target =
        "_blank";


      botao.rel =
        "noopener noreferrer";


      botao.className =
        "link";


      botao.textContent =
        link.nome || "🔗 Link";


      // =========================
      // CONTADOR DE CLIQUES
      // =========================

      botao.addEventListener(
        "click",
        async () => {

          try {

            const cliquesAtuais =
              Number(link.cliques || 0);


            await setDoc(

              doc(
                db,
                "links",
                documento.id
              ),

              {
                cliques:
                  cliquesAtuais + 1
              },

              {
                merge: true
              }

            );


            console.log(
              "Clique registrado!"
            );


          } catch (erro) {

            console.error(
              "Erro ao registrar clique:",
              erro
            );

          }

        }
      );


      lista.appendChild(botao);

    });


  } catch (erro) {

    console.error(
      "Erro ao carregar perfil:",
      erro
    );

  }

}


carregarPerfil();