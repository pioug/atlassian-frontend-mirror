# Follow-up: deprecate Popup `mode`

**Status:** TODO. Since the controlled wrappers ask first on close
([../decisions/wrappers-ask-first-close.md](../decisions/wrappers-ask-first-close.md)), `mode` only
matters for a Popup without `onClose`: the default mode takes Escape and stays open (as legacy);
`"manual"` ignores both. Decide whether to deprecate it.
