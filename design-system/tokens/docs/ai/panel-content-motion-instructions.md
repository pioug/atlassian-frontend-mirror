# Panel content motion

Use `motion.panel.content.open` when a panel opens. It includes a 100ms delay,
a 150ms fade with ExpoOut easing, and backwards fill to keep the content hidden
during the delay. Apply the complete animation without overriding its duration,
easing, or delay. Keep it attached until the fade finishes at 250ms, even though
the panel surface finishes sliding at 200ms.

Use `motion.panel.content.enter` and `motion.panel.content.exit` when replacing
content inside an already open panel. Those transitions do not use the opening
delay. Only apply animations under `prefers-reduced-motion: no-preference`.
