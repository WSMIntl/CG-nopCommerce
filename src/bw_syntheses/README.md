# Chemglass ChemSynt 301

This package is a standalone Chemglass adaptation of the VELP ChemSynt 301 product page. Open `index.html` directly in a current browser; no server, build step, login, or internet connection is required.

## Included behavior

- Four-image product gallery with previous/next boundaries and touch swiping.
- Description, Models, Technical Data, Download, and Service tabs with a mobile tab chooser.
- Both ChemSynt 301 models and their exact local included, required, and optional accessory groups.
- Accessory selection, model details, dependent quote-form fields, browser validation, and a Chemglass Technical Service email handoff.
- A separate eight-step product advisor at `configurator.html`, opened by the main configuration CTA. It calculates a recommendation and configuration code, then prepares a detailed Technical Service email.
- Keyboard-accessible tabs and dialogs, responsive desktop/mobile layouts, and local image assets.

## Email handling

Quote, service, brochure, and configuration requests use `technical-service@chemglass.com`. Submitting either request form opens the visitor's default email client with a prefilled message. If the browser blocks that handoff, the page offers a button to copy the complete request.

The brochure on the source site is account-protected, so the offline Download tab requests it from Chemglass Technical Service instead of linking to a nonfunctional authenticated VELP download.

## Files

- `index.html` — main product page.
- `configurator.html` — product configuration advisor.
- `css/` and `js/` — all page styling, product data, and behavior.
- `assets/images/` — all runtime image assets.
- `GAP_ANALYSIS.md` — detailed source-vs-implementation audit and resolution record.
- `assets-manifest.json` — complete asset inventory and provenance rules.

The supplied ZIP contains only delivery files. Extract it before opening `index.html` so the relative asset paths remain together.
