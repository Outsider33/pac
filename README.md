# PAC à 1 € — Landing B2C (ADN « La Primeur »)

Landing one-page de conversion (PAC à 1 € selon éligibilité, aides MaPrimeRénov' + CEE), avec
**simulateur d'éligibilité multi-étapes** et **pages légales**. Site **statique** (HTML/CSS/JS pur),
sans build, déployable sur **Cloudflare Pages**.

Design calé sur l'ADN documenté de Samuel + le site La Primeur : crème + noir + **accent terracotta**,
**un mot italique par titre**, **labels mono numérotés**, **shimmer dividers**, **zéro emoji**.
Produits nommés par **code de fiche CEE officiel** (BAR-TH-171 air/eau, BAR-TH-143 SSC).
Brand-sheet : `design/references/pac_brand.md`.

## Standards appliqués (refonte 2026-06-10)

- **Polices auto-hébergées** (`fonts/`, woff2 latin + latin-ext, `font-display:swap`) — conformité
  RGPD/CNIL (zéro requête Google Fonts/Fontshare) + perf (préchargement Inter/Fraunces).
- **Hero responsive** : `hero-bg-1920.jpg` (249 Ko) desktop / `hero-bg-900.jpg` (70 Ko) mobile,
  préchargées avec `media` + `fetchpriority`. (`hero-bg.jpg` = master original, non référencé.)
- **Conversion** : micro-engagement dans le hero (boutons Propriétaire/Locataire → pré-remplit
  l'étape 1 et saute à l'étape 2) · **sticky CTA mobile** (Appeler + Tester, masquée sur hero et
  formulaire) · email rendu **facultatif** (moins de friction, le téléphone reste la clé).
- **Attribution Ads** : champs cachés `utm_source/medium/campaign/term/content`, `gclid`,
  `page_url`, `referrer` remplis depuis l'URL → chaque lead Formspree porte sa campagne d'origine.
  Push `dataLayer` (`generate_lead`) à la soumission, prêt pour GTM/GA4.
- **Accessibilité** : skip-link, `:focus-visible` partout, fieldset/legend sur les étapes, gestion
  du focus entre étapes, ARIA combobox sur l'autocomplete BAN, progressbar ARIA, contrastes corrigés.
- **SEO** : JSON-LD `HVACBusiness` + `FAQPage`, OG complet + twitter card, `robots.txt`,
  `sitemap.xml`, `404.html`.
- **Sécurité (`_headers`)** : CSP stricte, X-Frame-Options, nosniff, Referrer-Policy,
  Permissions-Policy + cache immutable sur `assets/` et `fonts/`.
  ⚠ Si GA4/GTM est ajouté plus tard : étendre `script-src`/`connect-src` dans `_headers`.

```
pac_1euro_site/
├── index.html                      # landing (hero+quick-start → trust → 1€ → solutions → étapes →
│                                   #   preuve → garanties → FAQ → simulateur → footer + sticky CTA)
├── 404.html · robots.txt · sitemap.xml · _headers
├── mentions-legales.html           # éditeur ENR DISTRIB (SIREN 900 397 019), plateforme ISOCONSULTING33 LTD
├── politique-confidentialite.html  # RGPD : art. 6.1.b, 3/5 ans, sous-traitants, droits
├── styles.css · script.js
├── fonts/                          # woff2 auto-hébergés + fonts.css
└── assets/                         # seal.svg, favicons, hero-bg-*.jpg, bar-th-*.svg, og-image.png
```

## ▶ Tester en local
Double-clic `index.html`, ou n'importe quel serveur statique à la racine du dossier.

## ✅ Placeholders à remplir (recherche/remplacement)

| Placeholder | Fichiers | Remplacer par |
|---|---|---|
| `__TEL__` | index + légales | Téléphone (mettre `+33…` dans les `tel:`) |
| `__FORMSPREE_ID__` | index | ID Formspree (voir + bas) |
| `contact@pac-1euro.com` | index + légales | Email Workspace une fois créé (ou garder) |
| Date « 2026 » | pages légales | Date exacte de mise en ligne |

## 📋 Champs collectés (→ Formspree)
`statut · chauffage · nom_prenom · telephone · email (facultatif) · adresse · surface · creneau ·
consentement` + attribution (`utm_*`, `gclid`, `page_url`, `referrer`) + honeypot `_gotcha`.

## 📩 Formspree
Compte sur formspree.io → formulaire connecté à l'email de réception → remplacer `__FORMSPREE_ID__`
dans `index.html`. Tant qu'il n'est pas remplacé, le simulateur affiche un message de config (garde-fou).

## 🚀 Déploiement Cloudflare Pages
**Drag-and-drop** : Workers & Pages → Create → Pages → Upload assets → glisser le **contenu** du dossier
→ Custom domain `pac-1euro.com` (DNS du domaine actuellement parké chez Hostinger → pointer vers
Cloudflare). **Ou Git** : push → Connect to Git, build vide, output `/`.

## Hors-scope (après lancement)
Email Workspace · GA4/GTM (penser CSP) · Google Ads · calculateur d'aides dynamique (v2).
