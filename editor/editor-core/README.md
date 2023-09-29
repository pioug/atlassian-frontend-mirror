# editor-core

Main package for the Atlassian Editor.

## Quick Start

Current devloop involves leveraging the atlaskit website shell to build out examples.

0. After following https://hello.atlassian.net/wiki/spaces/AF/pages/2634599657/Getting+Started
1. `yarn start editor-core`

Then hit http://localhost:9000/examples/editor/editor-core

This opts you into the default esbuild configuration. If needing to fall back to webpack, this can be done via
`yarn start editor-core --experimental=webpack`

Running visual regression tests will also use the webpack build, due to the slight variation in how those assets are built for styling
`VISUAL_REGRESSION=true yarn start editor-core`

If you need to override the default port and run multiple builds side by side, use the `PORT` env variable: `PORT=9005 yarn start editor-core`
