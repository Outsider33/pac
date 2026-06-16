/* =========================================================================
   PAC à 1 € — script.js
   Reveals (v7), header scroll, sticky CTA mobile, quick-start hero,
   form 3 étapes (focus + ARIA), BAN autocomplete, masque tél, UTM/gclid.
   ========================================================================= */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  var y = $("#year"); if (y) y.textContent = new Date().getFullYear();

  /* ---- header solid au scroll ---- */
  var hdr = $(".hdr");
  function onScroll() { if (hdr) hdr.classList.toggle("solid", (scrollY || 0) > 40); }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---- reveals / stagger / mech ---- */
  var targets = $$(".reveal, .reveal-stamp, .stagger, .mech");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    targets.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < innerHeight * 0.92) { requestAnimationFrame(function () { el.classList.add("in"); }); }
      else io.observe(el);
    });
  } else { targets.forEach(function (el) { el.classList.add("in"); }); }

  /* ---- sticky CTA mobile : visible hors hero et hors formulaire ---- */
  var sticky = $("#stickyCta"), hero = $(".hero"), formSec = $("#formulaire");
  if (sticky && hero && formSec && "IntersectionObserver" in window) {
    var heroOut = false, formIn = false;
    function syncSticky() { sticky.classList.toggle("on", heroOut && !formIn); }
    new IntersectionObserver(function (es) { heroOut = !es[0].isIntersecting; syncSticky(); }, { threshold: 0.15 }).observe(hero);
    new IntersectionObserver(function (es) { formIn = es[0].isIntersecting; syncSticky(); }, { threshold: 0.1 }).observe(formSec);
  }

  /* =========================================================================
     FORMULAIRE — 3 étapes
     ========================================================================= */
  var form = $("#qual"); if (!form) return;
  var steps = ["qStep1", "qStep2", "qForm"];
  var cur = 0;
  var elNow = $("#qNow"), bar = $("#qBar"), barSpan = $("#qBar span"), status = $("#qStatus"), summary = $("#qSummary");
  var answers = {};

  /* ---- attribution : UTM / gclid / referrer dans les champs cachés ---- */
  try {
    var params = new URLSearchParams(location.search);
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"].forEach(function (k) {
      var input = form.querySelector('input[name="' + k + '"]');
      if (input && params.get(k)) input.value = params.get(k);
    });
    var pu = form.querySelector('input[name="page_url"]'); if (pu) pu.value = location.href.split("#")[0];
    var rf = form.querySelector('input[name="referrer"]'); if (rf) rf.value = document.referrer || "";
  } catch (e) {}

  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  function show(i, moveFocus) {
    cur = i;
    steps.forEach(function (id, idx) { $("#" + id).hidden = idx !== i; });
    $("#qSuccess").hidden = true;
    if (elNow) elNow.textContent = pad(i + 1);
    if (barSpan) barSpan.style.width = ((i + 1) / 3) * 100 + "%";
    if (bar) { bar.classList.toggle("full", i === 2); bar.setAttribute("aria-valuenow", i + 1); }
    setStatus("");
    if (i === 2) {
      summary.innerHTML =
        '<span><b>Statut&nbsp;:</b> ' + (answers.statut || "—") + ' <a href="#" data-goto="0">Modifier</a></span>' +
        '<span><b>Chauffage&nbsp;:</b> ' + (answers.chauffage || "—") + ' <a href="#" data-goto="1">Modifier</a></span>';
      var first = $("#qForm input[name=nom_prenom]");
      if (first && moveFocus !== false) setTimeout(function () { try { first.focus({ preventScroll: true }); } catch (e) {} }, 360);
    } else if (moveFocus) {
      var legend = $("#" + steps[i] + " legend");
      if (legend) setTimeout(function () { try { legend.focus({ preventScroll: true }); } catch (e) {} }, 360);
    }
  }
  function setStatus(m, err) { if (!status) return; status.textContent = m; status.className = "qual-status mono" + (err ? " err" : ""); }

  /* ---- quick-start depuis le hero : pré-sélectionne le statut ---- */
  $$("[data-qs]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = b.getAttribute("data-qs");
      var radio = form.querySelector('input[name="statut"][value="' + v + '"]');
      if (radio) { radio.checked = true; answers.statut = v; }
      show(1, false);
      formSec.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
      var legend = $("#qStep2 legend");
      if (legend) setTimeout(function () { try { legend.focus({ preventScroll: true }); } catch (e) {} }, reduce ? 0 : 600);
    });
  });

  // auto-advance radios
  $$("input[type=radio]", form).forEach(function (r) {
    r.addEventListener("change", function () {
      answers[r.name] = r.value;
      if (r.name === "statut") setTimeout(function () { show(1, true); }, 240);
      if (r.name === "chauffage") setTimeout(function () { show(2, true); }, 240);
    });
  });
  // back + modify
  form.addEventListener("click", function (e) {
    var b = e.target.closest("[data-back]"); if (b) { show(Math.max(0, cur - 1), true); return; }
    var g = e.target.closest("[data-goto]"); if (g) { e.preventDefault(); show(+g.getAttribute("data-goto"), true); }
  });

  /* ---- masque téléphone +33 ---- */
  var tel = $("#tel");
  if (tel) tel.addEventListener("input", function () {
    var d = tel.value.replace(/\D/g, "").replace(/^0/, "").slice(0, 9);
    tel.value = (d.match(/.{1,2}/g) || []).join(" ").replace(/^(\d)\s/, "$1 ");
  });

  /* ---- BAN autocomplete (api-adresse.data.gouv.fr) ---- */
  var ban = $("#ban"), banList = $("#banList"), banTimer, banIdx = -1, banItems = [];
  function closeBan() {
    if (!banList) return;
    banList.hidden = true; banList.innerHTML = ""; banIdx = -1; banItems = [];
    if (ban) { ban.setAttribute("aria-expanded", "false"); ban.removeAttribute("aria-activedescendant"); }
  }
  function markActive(divs) {
    divs.forEach(function (x, i) { x.classList.toggle("act", i === banIdx); x.setAttribute("aria-selected", i === banIdx ? "true" : "false"); });
    if (divs[banIdx]) ban.setAttribute("aria-activedescendant", divs[banIdx].id);
  }
  if (ban) {
    ban.addEventListener("input", function () {
      var q = ban.value.trim(); clearTimeout(banTimer);
      if (q.length < 3) { closeBan(); return; }
      banTimer = setTimeout(function () {
        fetch("https://api-adresse.data.gouv.fr/search/?q=" + encodeURIComponent(q) + "&limit=5&autocomplete=1")
          .then(function (r) { return r.json(); })
          .then(function (j) {
            banItems = (j.features || []);
            if (!banItems.length) { closeBan(); return; }
            banList.innerHTML = banItems.map(function (f, i) {
              var p = f.properties;
              return '<div role="option" id="ban-opt-' + i + '" aria-selected="false" data-i="' + i + '"><b>' + p.label + '</b><div class="ctx">' + (p.context || "") + '</div></div>';
            }).join("");
            banList.hidden = false; banIdx = -1;
            ban.setAttribute("aria-expanded", "true");
          }).catch(closeBan);
      }, 220);
    });
    banList.addEventListener("click", function (e) {
      var d = e.target.closest("[data-i]"); if (!d) return;
      ban.value = banItems[+d.getAttribute("data-i")].properties.label; closeBan();
    });
    ban.addEventListener("keydown", function (e) {
      if (banList.hidden) return;
      var divs = $$("div[data-i]", banList);
      if (e.key === "ArrowDown") { e.preventDefault(); banIdx = Math.min(divs.length - 1, banIdx + 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); banIdx = Math.max(0, banIdx - 1); }
      else if (e.key === "Enter" && banIdx >= 0) { e.preventDefault(); divs[banIdx].click(); return; }
      else if (e.key === "Escape") { closeBan(); return; } else return;
      markActive(divs);
    });
    document.addEventListener("click", function (e) { if (!e.target.closest(".ban")) closeBan(); });
  }

  /* ---- submit ---- */
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (form.action.indexOf("__FORMSPREE_ID__") !== -1) { setStatus("⚙ Configurez Formspree (remplacez __FORMSPREE_ID__).", true); return; }
    var fields = $$("#qForm input[required], #qForm select[required]");
    for (var i = 0; i < fields.length; i++) {
      if (!fields[i].checkValidity()) {
        var f = fields[i], box = f.closest(".field, label");
        f.reportValidity();
        if (box) { box.classList.add("shake"); setTimeout(function () { box.classList.remove("shake"); }, 400); }
        return;
      }
    }
    if (tel && !/^[1-9](\s?\d){8}$/.test(tel.value)) { tel.closest(".field").classList.add("shake"); setTimeout(function () { tel.closest(".field").classList.remove("shake"); }, 400); setStatus("Numéro de téléphone invalide.", true); return; }
    var btn = $(".qsubmit", form); var orig = btn ? btn.textContent : "";
    if (btn) { btn.disabled = true; btn.textContent = "Envoi…"; }
    var fd = new FormData(form); fd.set("telephone", "+33 " + tel.value);
    fetch(form.action, { method: "POST", body: fd, headers: { Accept: "application/json" } })
      .then(function (r) {
        if (r.ok) {
          steps.forEach(function (id) { $("#" + id).hidden = true; });
          $(".qual-top", form).hidden = true;
          var ok = $("#qSuccess"); ok.hidden = false;
          try { ok.focus({ preventScroll: true }); } catch (e2) {}
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: "generate_lead", lead_statut: answers.statut || "", lead_chauffage: answers.chauffage || "" });
        }
        else { setStatus("⚠ Une erreur est survenue. Réessayez ou appelez-nous.", true); }
      })
      .catch(function () { setStatus("⚠ Connexion impossible. Appelez-nous directement.", true); })
      .finally(function () { if (btn) { btn.disabled = false; btn.textContent = orig; } });
  });

  show(0, false);
})();
