/**
 * script.js
 * Comportamentos puros de UI — sem nenhum pixel, tracker ou postback.
 * Funcionalidades:
 *   1. Ano dinâmico no footer
 *   2. Modal de busca (abrir / fechar / ESC)
 *   3. Contador de espectadores com flutuação realista
 *   4. Animações de scroll via IntersectionObserver
 *   5. Toggle do menu hamburguer
 */

(function () {
  "use strict";

  /* ─────────────────────────────────────────
     1. ANO DINÂMICO NO FOOTER
  ───────────────────────────────────────── */
  var yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ─────────────────────────────────────────
     2. MODAL DE BUSCA
  ───────────────────────────────────────── */
  var searchBtn     = document.getElementById("search-btn");
  var searchModal   = document.getElementById("search-modal");
  var searchOverlay = document.getElementById("search-modal-overlay");
  var searchClose   = document.getElementById("search-modal-close");
  var searchInput   = document.getElementById("search-input");

  function openSearch() {
    if (!searchModal) return;
    searchModal.classList.add("is-open");
    document.body.style.overflow = "hidden";
    setTimeout(function () { if (searchInput) searchInput.focus(); }, 120);
  }

  function closeSearch() {
    if (!searchModal) return;
    searchModal.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  if (searchBtn)    searchBtn.addEventListener("click", openSearch);
  if (searchClose)  searchClose.addEventListener("click", closeSearch);
  if (searchOverlay) searchOverlay.addEventListener("click", closeSearch);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeSearch();
  });

  /* ─────────────────────────────────────────
     3. CONTADOR DE ESPECTADORES
     Simula flutuação entre 400 e 700, igual
     ao data-min / data-max do original.
  ───────────────────────────────────────── */
  var viewersEl = document.getElementById("viewers-count");

  if (viewersEl) {
    var viewers = parseInt(viewersEl.textContent, 10) || 608;

    function tickViewers() {
      // Variação aleatória entre -10 e +15 por ciclo
      var delta = Math.floor(Math.random() * 26) - 10;
      viewers = Math.max(400, Math.min(700, viewers + delta));
      viewersEl.textContent = viewers;
      // Próximo tick: entre 4 e 8 segundos
      setTimeout(tickViewers, 4000 + Math.random() * 4000);
    }

    // Primeiro tick após 3–5 s para não ser imediato
    setTimeout(tickViewers, 3000 + Math.random() * 2000);
  }

  /* ─────────────────────────────────────────
     4. ANIMAÇÕES DE SCROLL (fadeInUp)
     Aplica a classe ao entrar na viewport.
  ───────────────────────────────────────── */
  var targets = document.querySelectorAll(
    ".article-title, .article-subtitle, .article-author, .article-date, " +
    ".video-wrapper, .viewers-counter, .trust-image-block, " +
    ".comments-title, .fb-comment-card"
  );

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("fadeInUp");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    targets.forEach(function (el) {
      el.style.opacity = "0";
      io.observe(el);
    });
  } else {
    // Fallback: sem animação, apenas exibe
    targets.forEach(function (el) { el.style.opacity = "1"; });
  }

  /* ─────────────────────────────────────────
     5. MENU HAMBURGUER (toggle)
  ───────────────────────────────────────── */
  document.querySelectorAll(".hamburger-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.body.classList.toggle("menu-open");
    });
  });

})();
