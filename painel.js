import { auth, db } from "./firebase.js";

import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";


const btnSalvar =
  document.getElementById("btnSalvar");

const btnSalvarLinks =
  document.getElementById("btnSalvarLinks");

const btnLogout =
  document.getElementById("btnLogout");

const btnVerPerfil =
  document.getElementById("btnVerPerfil");


const nome =
  document.getElementById("nome");

const usuario =
  document.getElementById("usuario");

const bio =
  document.getElementById("bio");


const youtube =
  document.getElementById("youtube");

const kick =
  document.getElementById("kick");

const tiktok =
  document.getElementById("tiktok");

const discord =
  document.getElementById("discord");

const instagram =
  document.getElementById("instagram");

const twitch =
  document.getElementById("twitch");


let usuarioLogado = null;


// ================================
// USUÁRIO LOGADO
// ================================

onAuthStateChanged(
  auth,
  async (user) => {

    if (!user) {

      window.location.href =
        "index.html";

      return;
    }


    usuarioLogado = user;


    const perfilRef =
      doc(
        db,
        "usuarios",
        user.uid
      );


    const perfilSnap =
      await getDoc(perfilRef);


    if (perfilSnap.exists()) {

      const dados =
        perfilSnap.data();


      nome.value =
        dados.nome || "";

      usuario.value =
        dados.usuario || "";

      bio.value =
        dados.bio || "";

    }


    await carregarLinks(user.uid);

    await carregarEstatisticas(user.uid);

  }
);


// ================================
// SALVAR PERFIL
// ================================

if (btnSalvar) {

  btnSalvar.addEventListener(
    "click",
    async () => {

      if (!usuarioLogado) return;


      try {

        await setDoc(

          doc(
            db,
            "usuarios",
            usuarioLogado.uid
          ),

          {
            nome:
              nome.value.trim(),

            usuario:
              usuario.value.trim(),

            bio:
              bio.value.trim()
          },

          {
            merge: true
          }

        );


        alert(
          "Perfil salvo com sucesso!"
        );


      } catch (erro) {

        console.error(
          "Erro ao salvar perfil:",
          erro
        );

        alert(
          "Erro ao salvar perfil."
        );

      }

    }
  );

}


// ================================
// CARREGAR LINKS
// ================================

async function carregarLinks(
  usuarioId
) {

  const consulta =
    query(
      collection(
        db,
        "links"
      ),
      where(
        "usuarioId",
        "==",
        usuarioId
      )
    );


  const resultado =
    await getDocs(
      consulta
    );


  resultado.forEach(
    (documento) => {

      const link =
        documento.data();


      if (
        link.nome === "YouTube"
      ) {
        youtube.value =
          link.url || "";
      }


      if (
        link.nome === "Kick"
      ) {
        kick.value =
          link.url || "";
      }


      if (
        link.nome === "TikTok"
      ) {
        tiktok.value =
          link.url || "";
      }


      if (
        link.nome === "Discord"
      ) {
        discord.value =
          link.url || "";
      }


      if (
        link.nome === "Instagram"
      ) {
        instagram.value =
          link.url || "";
      }


      if (
        link.nome === "Twitch"
      ) {
        twitch.value =
          link.url || "";
      }

    }
  );

}


// ================================
// SALVAR LINKS
// ================================

if (btnSalvarLinks) {

  btnSalvarLinks.addEventListener(
    "click",
    async () => {

      if (!usuarioLogado) return;


      try {

        const links = [

          {
            nome: "YouTube",
            url:
              youtube.value.trim()
          },

          {
            nome: "Kick",
            url:
              kick.value.trim()
          },

          {
            nome: "TikTok",
            url:
              tiktok.value.trim()
          },

          {
            nome: "Discord",
            url:
              discord.value.trim()
          },

          {
            nome: "Instagram",
            url:
              instagram.value.trim()
          },

          {
            nome: "Twitch",
            url:
              twitch.value.trim()
          }

        ];


        // =========================
        // BUSCAR LINKS EXISTENTES
        // =========================

        const consulta =
          query(
            collection(db, "links"),
            where(
              "usuarioId",
              "==",
              usuarioLogado.uid
            )
          );


        const antigos =
          await getDocs(
            consulta
          );


        const existentes = {};


        antigos.forEach(
          (documento) => {

            const dados =
              documento.data();


            existentes[dados.nome] = {

              id:
                documento.id,

              cliques:
                Number(
                  dados.cliques || 0
                )

            };

          }
        );


        // =========================
        // ATUALIZAR / CRIAR
        // =========================

        const nomesAtuais = [];


        for (
          const link of links
        ) {

          if (!link.url) {
            continue;
          }


          nomesAtuais.push(
            link.nome
          );


          if (
            existentes[link.nome]
          ) {

            // Mantém o mesmo documento
            // e mantém os cliques

            await setDoc(

              doc(
                db,
                "links",
                existentes[
                  link.nome
                ].id
              ),

              {
                nome:
                  link.nome,

                url:
                  link.url,

                usuarioId:
                  usuarioLogado.uid,

                cliques:
                  existentes[
                    link.nome
                  ].cliques
              },

              {
                merge: true
              }

            );

          } else {

            // Link novo

            await addDoc(

              collection(
                db,
                "links"
              ),

              {
                nome:
                  link.nome,

                url:
                  link.url,

                usuarioId:
                  usuarioLogado.uid,

                cliques:
                  0
              }

            );

          }

        }


        // =========================
        // REMOVER LINKS APAGADOS
        // =========================

        for (
          const documento
          of antigos.docs
        ) {

          const dados =
            documento.data();


          if (
            !nomesAtuais.includes(
              dados.nome
            )
          ) {

            await deleteDoc(
              documento.ref
            );

          }

        }


        await carregarEstatisticas(
          usuarioLogado.uid
        );


        alert(
          "Links salvos com sucesso!"
        );


      } catch (erro) {

        console.error(
          "Erro ao salvar links:",
          erro
        );

        alert(
          "Erro ao salvar links."
        );

      }

    }
  );

}


// ================================
// ESTATÍSTICAS
// ================================

async function carregarEstatisticas(
  usuarioId
) {

  const lista =
    document.getElementById(
      "listaEstatisticas"
    );


  const total =
    document.getElementById(
      "totalCliques"
    );


  if (!lista || !total) {
    return;
  }


  lista.innerHTML = "";


  try {

    const consulta =
      query(
        collection(db, "links"),
        where(
          "usuarioId",
          "==",
          usuarioId
        )
      );


    const resultado =
      await getDocs(
        consulta
      );


    let totalCliques = 0;


    resultado.forEach(
      (documento) => {

        const dados =
          documento.data();


        const cliques =
          Number(
            dados.cliques || 0
          );


        totalCliques +=
          cliques;


        const item =
          document.createElement(
            "div"
          );


        item.className =
          "estatisticaItem";


        item.innerHTML = `

          <span>
            ${dados.nome || "Link"}
          </span>

          <strong>
            ${cliques}
          </strong>

        `;


        lista.appendChild(
          item
        );

      }
    );


    total.textContent =
      totalCliques;


  } catch (erro) {

    console.error(
      "Erro ao carregar estatísticas:",
      erro
    );

  }

}


// ================================
// VER PERFIL PÚBLICO
// ================================

if (btnVerPerfil) {

  btnVerPerfil.addEventListener(
    "click",
    () => {

      if (!usuarioLogado) {

        alert(
          "Usuário ainda não carregado."
        );

        return;
      }


      window.location.href =
        "./perfil.html?uid=" +
        encodeURIComponent(
          usuarioLogado.uid
        );

    }
  );

}


// ================================
// SAIR
// ================================

if (btnLogout) {

  btnLogout.addEventListener(
    "click",
    async () => {

      await signOut(auth);

      window.location.href =
        "index.html";

    }
  );

}