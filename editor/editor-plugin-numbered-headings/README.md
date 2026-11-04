# Numbered headings

Adds decimal heading numbers with node decorations and a Text styles toggle, behind
`platform_editor_numbered_headings`.

The on/off setting is the `numberedHeadings.enabled` value of `@atlaskit/editor-plugin-external-state`,
a required dependency. Numbering starts from the stored value, follows changes to it (late loads,
collaborators), and the toolbar toggle saves through that plugin's provider, which reverts a failed
save. Without a provider, the setting lives in editor state for one editor instance and starts off.
The toggle changes no ADF; it can be undone and redone, including while the Text styles menu is open. Document changes still recalculate or map
the heading decorations.

The Confluence full-page preset includes this plugin in its legacy and next paths when
`platform_editor_numbered_headings` is enabled and `enabledOptionalPlugins.numberedHeadings` is
true. It adds the external state plugin when `enabledOptionalPlugins.externalState` is also true. The preset controls where the toggle is available; the plugin does not restrict editor
appearances.
