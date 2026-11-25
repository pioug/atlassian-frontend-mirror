# Floating controls following a panel

Use `motion.floating.controls.follow.panel.enter` and `motion.floating.controls.follow.panel.exit` as CSS transitions on
floating controls translated horizontally using `transform`. They follow the panel with a 200ms
ExpoOut entrance and a 200ms QuartOut exit, respectively. Update the translation when the panel
starts moving. Transforms keep moving on the compositor while the main content redraws; animating
an inset can stall and leave the control behind the panel. Anchor at `inset-inline-end` and translate
toward inline start (negative X in LTR, positive X in RTL).

The consumer owns the panel width, edge gap, viewport clamping, and whether a control follows or
stays in place while disappearing. Disable the transition during manual panel resizing. Apply
these transitions only under `prefers-reduced-motion: no-preference`.

These tokens do not change opacity or vertical position. Compose those transitions in the owning
component; for example, Confluence's floating bar moves down when the Ask Rovo launcher disappears.
