# @atlaskit/editor-core

A package contains Atlassian editor core functionality.

## Description

This is the main package for the Atlassian Editor, providing the core functionality and components needed to build rich text editing experiences. It includes composable editor components, presets for different use cases (full-page, comment, chromeless), and the foundational infrastructure for the editor ecosystem.

## Key Features

### Editor Components
- **Composable Editor**: Modern composable editor architecture
- **Full Page Editor**: Complete editing experience for documents
- **Comment Editor**: Lightweight editor for comments and short content
- **Chromeless Editor**: Minimal editor without surrounding UI

### Presets and Configuration
- **Default Preset**: Standard editor configuration with common features
- **Universal Preset**: Flexible preset supporting multiple use cases
- **Custom Presets**: Extensible preset system for tailored configurations

### Core Infrastructure
- **Plugin System**: Extensible plugin architecture
- **Editor View**: ProseMirror-based editing foundation
- **Performance Tracking**: Built-in performance monitoring and analytics
- **Error Boundaries**: Robust error handling and recovery

### UI Components
- **Toolbar Systems**: Primary, floating, and contextual toolbars
- **Context Panels**: Side panels for additional editor controls
- **Element Browser**: Quick insert interface for content elements

## Examples

The package includes comprehensive examples in the `examples/` directory covering:
- Kitchen sink demonstration
- Different editor appearances and configurations
- Collaborative editing setups
- Media handling and integrations
- Performance testing scenarios

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

## Team

**Editor**
