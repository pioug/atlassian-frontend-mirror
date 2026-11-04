# Follow-up: legacy AUI prevents every Escape on some jira pages

**Status:** TODO, needs investigation first.

A legacy AUI `document` listener on some jira pages calls `preventDefault()` on every Escape
(JRACLOUD-97876). Top-layer code reads a prevented Escape as "a layer above took it":

- Popovers claim an Escape from inside them before `document` listeners, so they should still close.
- Select menus listen on `document` and may run after AUI, so they may stay open.
- Dialog listens on `window`, after `document`, so a modal may never close on Escape.

Two jira workarounds exist for this on the top-layer path: `useCloseMenuOnEscape` and
`FieldInfoPopup` in admin agent config.

Next: find the AUI handler and the pages that load it; check the real listener order in a browser;
then likely gate off AUI's Escape `preventDefault` on top-layer pages and remove the two
workarounds. Do not stop trusting `defaultPrevented` in the design system.
