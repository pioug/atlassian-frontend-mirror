# Layering

Layering provides consistent and accessible layered experience.

## Deprecated

This package is deprecated. Do not add new usages. The browser top layer handles stacking and Escape
natively. Use `@atlaskit/top-layer`. To check whether an overlay is open, use
`hasOpenDialogOrPopover` from the `@atlaskit/top-layer/page-surface` entry points. During the
rollout, pass `isEnabled: !fg('platform-dst-top-layer')` to the layering hooks, and do not render
`Layering` or the observer providers when the gate is on. See the usage page for the full migration
table.

[Learn more about why we introcue the package and how to use it](https://hello.atlassian.net/wiki/spaces/~63ff0a61f00d095406f28492/pages/2984762483/Layering+package+introduction)
