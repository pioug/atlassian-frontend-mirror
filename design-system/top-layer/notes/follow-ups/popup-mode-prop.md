# Follow-up: deprecate Popup `mode`

**Status:** Done (D20, 26 Nov 2026). Since the controlled wrappers ask first on close
([../decisions/wrappers-ask-first-close.md](../decisions/wrappers-ask-first-close.md)), `mode` only
mattered for a Popup without `onClose`: the default mode took Escape and stayed open (as legacy);
`"manual"` ignored both.

## Outcome

D20 makes a Popup without `onClose` take no Escape in both modes, so `mode` has no effect on either
path. D20 removes the prop from `Popup` in a major release, and removes it from every callsite on
local consumption.
