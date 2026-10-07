
var CONFIG = {
  GTM_ID: "GTM-XXXXXXX" // À REMPLACER
};

(function () {
  "use strict";

    /* ---- GTM INJECTION ---- */
  if (CONFIG.GTM_ID && CONFIG.GTM_ID !== 'GTM-XXXXXXX') {
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer',CONFIG.GTM_ID);
  }

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };

  /* ---- consentement ---- */
  var consentBanner = $("#consentBanner");
  var btnAcc = $("#btnConsentAcc"), btnRef = $("#btnConsentRef"), linkManage = $("#linkManageCookies");

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}

  // Consent Mode v2 par défaut
  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'analytics_storage': 'denied'
  });

  var btnCust = $("#btnConsentCust"), btnSave = $("#btnConsentSave");
  var chkAds = $("#chkAds"), chkAnalytics = $("#chkAnalytics"), consentOpts = $("#consentOptions");

  function applyConsent(ads, analytics) {
    gtag('consent', 'update', {
      'ad_storage': ads ? 'granted' : 'denied',
      'ad_user_data': ads ? 'granted' : 'denied',
      'ad_personalization': ads ? 'granted' : 'denied',
      'analytics_storage': analytics ? 'granted' : 'denied'
    });
    localStorage.setItem("pac_consent", JSON.stringify({ ad: ads, analytics: analytics }));
    if(consentBanner) consentBanner.style.transform = "translateY(100%)";
  }

  var savedConsentStr = localStorage.getItem("pac_consent");
  if (savedConsentStr) {
    try {
      var saved = JSON.parse(savedConsentStr);
      applyConsent(!!saved.ad, !!saved.analytics);
    } catch(e) {
      applyConsent(savedConsentStr === "1", savedConsentStr === "1"); // Fallback migration
    }
  } else if (consentBanner) {
    setTimeout(function() { consentBanner.style.transform = "translateY(0)"; }, 1000);
  }

  if (btnAcc) btnAcc.addEventListener("click", function() { applyConsent(true, true); });
  if (btnRef) btnRef.addEventListener("click", function() { applyConsent(false, false); });
  if (btnCust) btnCust.addEventListener("click", function() {
    if (consentOpts) consentOpts.style.display = "block";
    btnAcc.style.display = "none";
    btnRef.style.display = "none";
    btnCust.style.display = "none";
    if (btnSave) btnSave.style.display = "inline-block";
  });
  if (btnSave) btnSave.addEventListener("click", function() {
    applyConsent(chkAds && chkAds.checked, chkAnalytics && chkAnalytics.checked);
  });
  
  if (linkManage) linkManage.addEventListener("click", function(e) {
    e.preventDefault();
    if(consentBanner) consentBanner.style.transform = "translateY(0)";
    if(btnCust) btnCust.click(); // Rouvrir direct le panneau avancé
  });

  /* ---- header solid au scroll ---- */
  var hdr = $(".hdr");
  function onScroll() { if (hdr) hdr.classList.toggle("solid", (scrollY || 0) > 40); }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---- reveals / stagger / mech ---- */
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ob = "IntersectionObserver" in window ? new IntersectionObserver(function (es, obs) {
    es.forEach(function (e) {
      if (e.isIntersecting) {
        var el = e.target; el.classList.add("in"); obs.unobserve(el);
        if (el.classList.contains("stagger")) $$("li, .card, .step, .gar-card", el).forEach(function (c, i) { setTimeout(function () { c.classList.add("in"); }, i * (reduce ? 0 : 100)); });
      }
    });
  }, { threshold: 0.1 }) : null;
  if (ob) $$(".reveal, .stagger").forEach(function (el) { ob.observe(el); });
  else $$(".reveal, .stagger, .step, .card, .gar-card, li").forEach(function (el) { el.classList.add("in"); });

  /* ---- sticky CTA mobile ---- */
  var sticky = $("#stickyCta"), hero = $(".hero"), formSec = $("#formulaire");
  if (sticky && hero && formSec && "IntersectionObserver" in window) {
    var heroOut = false, formIn = false;
    function syncSticky() { sticky.classList.toggle("on", heroOut && !formIn); }
    new IntersectionObserver(function (es) { heroOut = !es[0].isIntersecting; syncSticky(); }, { threshold: 0.15 }).observe(hero);
    new IntersectionObserver(function (es) { formIn = es[0].isIntersecting; syncSticky(); }, { threshold: 0.1 }).observe(formSec);
  }

  /* ---- Message Match / UTM Fields ---- */
  var urlParams = new URLSearchParams(window.location.search);
  var hiddenFields = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"];
  hiddenFields.forEach(function(key) {
    var val = urlParams.get(key);
    var el = document.getElementById(key);
    if (el && val && !el.value) el.value = val;
  });
  var pUrl = document.getElementById("page_url"); if (pUrl && !pUrl.value) pUrl.value = window.location.href.split('?')[0];
  var pRef = document.getElementById("referrer"); if (pRef && !pRef.value && document.referrer) pRef.value = document.referrer;

  var heroSub = $(".hero h1");
  if (heroSub) {
    var camp = (urlParams.get("utm_campaign") || "").toLowerCase();
    var term = (urlParams.get("utm_term") || "").toLowerCase();
    var combined = camp + " " + term;
    if (combined.indexOf("fioul") !== -1) {
      heroSub.textContent = "Remplacez votre chaudière fioul. Aides MaPrimeRénov' et CEE déduites de votre devis.";
    } else if (combined.indexOf("gaz") !== -1) {
      heroSub.textContent = "Remplacez votre chaudière gaz. Aides MaPrimeRénov' et CEE déduites de votre devis.";
    } else if (combined.indexOf("aide") !== -1 || combined.indexOf("prime") !== -1) {
      heroSub.textContent = "Vérifiez les aides et votre reste à charge.";
    }
  }

  /* ---- FORMULAIRE ---- */
  var form = $("#qual"); if (!form) return;
  var steps = ["qStep1", "qStep2", "qStep3", "qStep4", "qStep5"];
  var cur = 0;
  var elNow = $("#qNow"), bar = $("#qBar"), barSpan = $("#qBar span"), status = $("#qStatus");
  var answers = {};
  var formStarted = false;

  function setStatus(msg, err) {
    if (!status) return;
    status.textContent = msg;
    status.style.color = err ? "var(--ocre-500)" : "inherit";
    status.classList.toggle("err", !!err);
  }

  function pad(n) { return n < 10 ? "0" + n : n; }

  function show(i, moveFocus) {
    if(!formStarted) {
      formStarted = true;
      dataLayer.push({ event: "form_start" });
    }
    dataLayer.push({ event: "form_step_" + (i + 1) });

    cur = i;
    steps.forEach(function (id, idx) {
      var el = $("#" + id);
      if (el) el.hidden = (idx !== i);
    });
    if (elNow) elNow.textContent = pad(i + 1);
    if (barSpan) barSpan.style.width = ((i + 1) / 5) * 100 + "%";
    if (bar) { bar.classList.toggle("full", i === 4); bar.setAttribute("aria-valuenow", i + 1); }
    setStatus("");
    
    // Reward screen updates dynamically if step 7
    if (i === 4) {
      if (!answers.statut || !answers.chauffage || !answers.logement || !$("#fSurface").value) {
        $("#qReward").hidden = true;
        $("#qRewardFail").hidden = false;
      } else {
        $("#qReward").hidden = false;
        $("#qRewardFail").hidden = true;
        
        var chaufItem = $("#rwdChaufItem");
        if (answers.chauffage === "Électrique") {
            chaufItem.innerHTML = "<span class=\"mono\" style=\"color:var(--ink-500);margin-right:.5rem;\">01</span><b>Votre logement</b> : compatible avec un Système Solaire Combiné";
        } else {
            chaufItem.innerHTML = "<span class=\"mono\" style=\"color:var(--ink-500);margin-right:.5rem;\">01</span><b>Chaudière " + answers.chauffage.toLowerCase() + "</b> : prioritaire pour le remplacement";
        }
        
        var aideTxt = (answers.statut === "Propriétaire bailleur") ? "Aides possibles, montant confirmé lors de l'étude" : (answers.statut === "Locataire") ? "Information Locataire : Les aides sont versées à votre propriétaire, pas directement à vous. Si vous êtes motivé, on peut vous envoyer un dossier à lui transmettre." : "Aides MaPrimeRénov' et CEE déduites de votre devis, et jusqu'à 0 € de reste à charge pour les foyers les plus modestes selon votre dossier.";
        $("#rwdAidesTxt").textContent = aideTxt;
        $("#rwdAides").style.display = "list-item";
      }

      var first = $("#qStep5 input[name=nom_prenom]");
      if (first && moveFocus !== false) setTimeout(function () { try { first.focus({ preventScroll: true }); } catch (e) {} }, 360);
    } else if (moveFocus) {
      var s = $("#" + steps[i]);
      var legend = s ? s.querySelector("legend") : null;
      if (legend) setTimeout(function () { try { legend.focus({ preventScroll: true }); } catch (e) {} }, 360);
    }
  }

  function showHorsCible(msg, reason) {
    steps.forEach(function (id) { var el = document.getElementById(id); if(el) el.hidden = true; });
    var top = document.querySelector(".qual-top"); if(top) top.hidden = true;
    var out = document.getElementById("qHorsCible"); 
    if(out) { 
      var m = document.getElementById("hcMsg");
      if(m && msg) m.textContent = msg;
      out.hidden = false; 
      try { out.focus({ preventScroll: true }); } catch (e) {} 
    }
    dataLayer.push({ event: "lead_hors_cible", reason: reason || answers.logement || answers.statut || answers.chauffage });
  }

  function showSsc() {
    steps.forEach(function (id) { var el = document.getElementById(id); if(el) el.hidden = true; });
    var top = document.querySelector(".qual-top"); if(top) top.hidden = true;
    var ssc = document.getElementById("qSsc");
    if(ssc) { ssc.hidden = false; try { ssc.focus({ preventScroll: true }); } catch (e) {} }
  }

  

  var btnContinueSsc = document.getElementById("btnContinueSsc");
  if(btnContinueSsc) {
    btnContinueSsc.addEventListener("click", function() {
      var ssc = document.getElementById("qSsc"); if(ssc) ssc.hidden = true;
      var top = document.querySelector(".qual-top"); if(top) top.hidden = false;
      show(2, true);
    });
  }

  // clicks
  form.addEventListener("click", function (e) {
    var b = e.target.closest("[data-back]"); 
    if (b) { 
      // Si on est sur l'écran SSC et qu'on fait retour
      var ssc = b.closest("#qSsc");
      if (ssc) {
        ssc.hidden = true;
        var top = document.querySelector(".qual-top"); if(top) top.hidden = false;
        show(1, true);
        return;
      }
      show(Math.max(0, cur - 1), true); 
      return; 
    }
    
    var n = e.target.closest("[data-next]"); 
    if (n) {
      var step = n.closest(".qstep");
      var fields = step.querySelectorAll("input[required], select[required]");
      for (var i = 0; i < fields.length; i++) {
        if (!fields[i].checkValidity()) {
          fields[i].reportValidity();
          var box = fields[i].closest(".field, label");
          if (box) { box.classList.add("shake"); setTimeout(function(bx){return function(){bx.classList.remove("shake")}}(box), 400); }
          return;
        }
      }
      show(Math.min(steps.length - 1, cur + 1), true);
    }
  });

  // Radios
  $$("input[type=radio]", form).forEach(function (r) {
    r.addEventListener("change", function () {
      answers[r.name] = r.value;
      
      if (r.name === "statut") {
        // 07/10 : un locataire suit la même fiche que le propriétaire (demande de Madina : il faut tous les avoir au téléphone)
        setTimeout(function () { show(1, true); }, 240);
      }

      if (r.name === "chauffage") {
        if (answers.chauffage === "Autre") {
          setTimeout(function() { showHorsCible("Malheureusement, au vu de vos réponses, vous ne remplissez pas les conditions d'éligibilité pour cette aide.", "chauffage_autre"); }, 240);
        } else if (answers.chauffage === "Électrique") {
          // 07/10 au soir : l'électrique revient, vers le Système Solaire Combiné
          setTimeout(showSsc, 240);
        } else {
          setTimeout(function () { show(2, true); }, 240);
        }
      }

      if (r.name === "logement") {
        if (answers.logement === "Appartement") {
          setTimeout(function() { showHorsCible("La pompe à chaleur air/eau nécessite l'installation d'une unité extérieure encombrante et est très rarement compatible ou autorisée en appartement.", "appartement"); }, 240);
        } else {
          setTimeout(function () { show(3, true); }, 240);
        }
      }

      
    });
  });

  /* ---- quick-start depuis le hero : pré-sélectionne le statut (restauré de b703122, 3 statuts) ---- */
  $$("[data-qs]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = b.getAttribute("data-qs");
      var radio = form.querySelector('input[name="statut"][value="' + v + '"]');
      if (radio) { radio.checked = true; answers.statut = v; }
      ["qSsc", "qHorsCible"].forEach(function (id) { var el = document.getElementById(id); if (el) el.hidden = true; });
      var top = document.querySelector(".qual-top"); if (top) top.hidden = false;
      show(1, false);
      if (formSec) formSec.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
      var legend = $("#qStep2 legend");
      if (legend) setTimeout(function () { try { legend.focus({ preventScroll: true }); } catch (e) {} }, reduce ? 0 : 600);
    });
  });

  // Validation Surface : 20 a 250 m2. Le message enonce NOTRE perimetre d'intervention,
  // pas une regle imposee au visiteur, et il laisse une porte de sortie (le telephone)
  // plutot que de clore le parcours.
  var fSurf = $("#fSurface");
  var surfErr = $("#surfErr");
  if(fSurf) fSurf.addEventListener("input", function() {
    var v = parseInt(this.value, 10);
    if (v < 20 || v > 250) {
      this.setCustomValidity("Nous intervenons sur des logements de 20 à 250 m² habitables.");
      this.setAttribute("aria-invalid", "true");
      if (surfErr) surfErr.innerHTML = "Nos installateurs interviennent sur des logements de <strong>20 à 250 m²</strong> habitables. En dehors de cette plage, votre projet demande une étude à part : appelez-nous au <a href='tel:+33780948205' style='color:inherit;text-decoration:underline;'>07 80 94 82 05</a>.";
    } else {
      this.setCustomValidity("");
      this.removeAttribute("aria-invalid");
      if (surfErr) surfErr.textContent = "";
    }
  });

  /* ---- masque téléphone +33 ---- */
  var tel = $("#tel");
  if (tel) tel.addEventListener("input", function () {
    var d = tel.value.replace(/\D/g, "").replace(/^0/, "").slice(0, 9);
    tel.value = (d.match(/.{1,2}/g) || []).join(" ").replace(/^(\d)\s/, "$1 ");
  });

  /* ---- BAN autocomplete ---- */
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
  // 07/10 (demande de Madina) : un seul parcours, par téléphone, pour tous les statuts.
  // L'offre « email seulement » et le dossier locataire envoyé par email sont retirés.
  var isSubmitting = false;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (isSubmitting) return;

    if (form.action.indexOf("__FORMSPREE_ID__") !== -1) { setStatus("Configurez Formspree (remplacez __FORMSPREE_ID__).", true); return; }

    var visibleFieldset = document.querySelector(".qstep:not([hidden])");
    var fields = visibleFieldset ? $$("input[required], select[required]", visibleFieldset) : [];
    for (var i = 0; i < fields.length; i++) {
      if (!fields[i].checkValidity()) {
        var f = fields[i], box = f.closest(".field, label");
        f.reportValidity();
        if (box) { box.classList.add("shake"); setTimeout(function () { box.classList.remove("shake"); }, 400); }
        return;
      }
    }
    if (!/^[1-9](\s?\d){8}$/.test(tel.value)) { tel.closest(".field").classList.add("shake"); setTimeout(function () { tel.closest(".field").classList.remove("shake"); }, 400); setStatus("Numéro de téléphone invalide.", true); return; }

    var btn = $(".qsubmit", visibleFieldset || form); var orig = btn ? btn.textContent : "";
    if (btn) { btn.disabled = true; btn.textContent = "Envoi…"; }
    isSubmitting = true;

    // Normalisation téléphone en format E.164
    var rawTel = tel.value.replace(/\D/g, "");
    if (rawTel.startsWith("0")) rawTel = rawTel.slice(1);

    var fd = new FormData(form);
    fd.set("telephone", "+33" + rawTel);

    // Art. R223-4 c. consommation : horodater la demande du consommateur.
    // C'est la justification de « la réalité de la demande d'information », à archiver 3 ans.
    fd.set("demande_horodatage", new Date().toISOString());

    fetch(form.action, { method: "POST", body: fd, headers: { Accept: "application/json" } })
      .then(function (r) {
        if (r.ok) {
          steps.forEach(function (id) { $("#" + id).hidden = true; });
          $(".qual-top", form).hidden = true;
          var ok = $("#qSuccess"); ok.hidden = false;
          try { ok.focus({ preventScroll: true }); } catch (e2) {}

          // Un locataire ne peut pas engager les travaux sans son propriétaire : c'est un vrai
          // contact à rappeler, mais pas la conversion que Google Ads doit apprendre à acheter.
          // Événement distinct, pour pouvoir le suivre sans qu'il pilote les enchères.
          var locataire = answers.statut === "Locataire";
          dataLayer.push({ event: locataire ? "lead_locataire" : "form_submit_success",
            lead_canal: "telephone",
            lead_statut: answers.statut || "", lead_chauffage: answers.chauffage || "", lead_logement: answers.logement || "" });
        }
        else { setStatus("Une erreur est survenue. Réessayez ou appelez-nous.", true); }
      })
      .catch(function () { setStatus("Connexion impossible. Appelez-nous directement.", true); })
      .finally(function () {
        isSubmitting = false;
        if (btn) { btn.disabled = false; btn.textContent = orig; }
      });
  });

  /* ---- Générateur ICS ---- */
  // 07/10 : l'événement d'agenda reprend le créneau choisi ; sans préférence, 9 h le jour ouvré suivant.
  var btnIcs = $("#btnIcs");
  if (btnIcs) {
    btnIcs.addEventListener("click", function () {
      var d = new Date();
      d.setDate(d.getDate() + 1);
      // Sauter samedi/dimanche
      if (d.getDay() === 6) d.setDate(d.getDate() + 2); // Si samedi -> lundi
      else if (d.getDay() === 0) d.setDate(d.getDate() + 1); // Si dimanche -> lundi

      var sel = $("#fCreneau");
      var m = sel ? /^(\d{1,2})\D+(\d{1,2})/.exec(sel.value) : null;
      var debut = m ? +m[1] : 9, fin = m ? +m[2] : null;
      d.setHours(debut, 0, 0, 0); // heure locale
      var end = fin ? new Date(d.getTime() + (fin - debut) * 3600000) : new Date(d.getTime() + 30 * 60000);

      // format YYYYMMDDTHHMMSSZ (en UTC)
      function fmt(dt) { return dt.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"; }

      var ics = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//PAC 1 EURO//NONSGML v1.0//EN\nBEGIN:VEVENT\n";
      ics += "UID:" + Date.now() + "@pac-1euro.com\n";
      ics += "DTSTAMP:" + fmt(new Date()) + "\n";
      ics += "DTSTART:" + fmt(d) + "\n";
      ics += "DTEND:" + fmt(end) + "\n";
      ics += "SUMMARY:Appel d'estimation PAC à 1 €\n";
      ics += "DESCRIPTION:Un conseiller vous rappelle depuis le 07 80 94 82 05 pour votre estimation" + (fin ? ", entre " + debut + " h et " + fin + " h" : "") + ".\n";
      ics += "END:VEVENT\nEND:VCALENDAR";

      var blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      btnIcs.href = url;
    });
  }

  show(0, false);
})();
