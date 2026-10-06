# Selection input motion

Use `motion.input.selection` for checkbox and radio state cross-fades. Apply the same token to
the control's surface, border and indicator layers. It transitions `background-color`,
`border-color`, `color`, `fill`, `stroke` and `opacity` with 150ms practical ease-out in both
directions. This supports HTML and SVG layers; only properties whose values change animate.

Keep indicators mounted and change their opacity between 0 and 1. The token does not scale the
control or animate its focus outline. Set `transition: none` for reduced motion and preserve
forced-colour handling.

Use the existing `motion.input` token for other inputs' hover, focus and error transitions.
Its background, border and box-shadow transition values are unchanged.
