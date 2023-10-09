# editor media
Media package for the Atlassian Editor.
## Quick Start
Current devloop involves leveraging the atlaskit website shell to build out examples.
0. After following https://hello.atlassian.net/wiki/spaces/AF/pages/2634599657/Getting+Started
1. `yarn start:media` at the root of the project to run only media examples OR
   `yarn start editor-core` at the root of the project and then http://localhost:9000/examples/editor/editor-core/kitchen-sink to run media components integrated in editor
To run tests run following at the root of the project:
    `yarn test <relative test file path>` for running a specific unit test
    `yarn test:vr <relative test file path>` for running VR test headless
    `yarn test:vr:debug <relative test file path>`for debugging VR test in Chrome instance
