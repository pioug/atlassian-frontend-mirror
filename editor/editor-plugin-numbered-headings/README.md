# Numbered headings

Adds decimal heading numbers with node decorations and a Text styles toggle, behind
`platform_editor_numbered_headings`.

The plugin owns its on/off state for one editor instance and always starts off. The toolbar
toggle changes that state without changing ADF or entering undo history. A new editor instance
starts off again. No public command or configuration is exposed while the API contract is being confirmed. The plugin has no persistence or multiplayer
setting synchronization. Document changes still recalculate or map the heading decorations.

The Confluence full-page preset includes this plugin in its legacy and next paths when
`platform_editor_numbered_headings` is enabled and `enabledOptionalPlugins.numberedHeadings` is
true. The preset controls where the toggle is available; the plugin does not restrict editor
appearances. It requires no persistence provider.
