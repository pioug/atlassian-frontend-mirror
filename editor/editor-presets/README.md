# @atlaskit/editor-presets

Public editor presets for Atlassian Editor containing base configurations for Confluence and other products.

## Overview

This package provides standardized, open-source, and easily consumable presets for the Atlassian Editor. It enables rapid prototyping, experimentation, and integration in external environments such as Replit, Figma Make, and other designer and developer tools.

## Available Presets

### Confluence Full Page Base Preset

The `confluenceFullPagePresetBase` contains all public plugins and configurations used by the Confluence Full Page Editor.

```typescript
import { confluenceFullPagePresetBase } from '@atlaskit/editor-presets';

const preset = confluenceFullPagePresetBase({
  intl,
  providers,
  enabledOptionalPlugins,
  pluginOptions,
});
```

## Usage

### Basic Setup

```typescript
import React from 'react';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { confluenceFullPagePresetBase } from '@atlaskit/editor-presets';
import { useIntl } from 'react-intl-next';

function MyEditor() {
  const intl = useIntl();
  
  const preset = confluenceFullPagePresetBase({
    intl,
    providers: {
      // Provide necessary services
    },
    enabledOptionalPlugins: {
      // Configure optional features
    },
    pluginOptions: {
      // Plugin-specific options
    },
  });

  return <ComposableEditor preset={preset} />;
}
```

### Extending the Preset

You can extend the base preset with additional plugins:

```typescript
import { confluenceFullPagePresetBase } from '@atlaskit/editor-presets';
import { myCustomPlugin } from './my-custom-plugin';

const customPreset = confluenceFullPagePresetBase(options)
  .add([myCustomPlugin, myCustomPluginOptions]);
```

## Plugin Options

Each plugin included in the preset can be configured through the `pluginOptions` object. Refer to individual plugin documentation for available options.

## API

### `confluenceFullPagePresetBase(options: ConfluenceFullPageBasePresetOptions): EditorPresetBuilder`

Creates a base Confluence Full Page Editor preset with all public plugins.

**Parameters:**
- `intl: IntlShape` - React Intl instance for internationalization
- `providers: Providers` - Required service providers
- `enabledOptionalPlugins: EnabledOptionalPlugins` - Configuration for optional plugins
- `pluginOptions: AllPluginOptions` - Plugin-specific configuration options

**Returns:** `EditorPresetBuilder` - A preset builder that can be extended with additional plugins

## Architecture

The public preset contains only `@atlaskit/editor-plugin-*` packages. Private or product-specific plugins should be added in separate preset packages (e.g., `editor-presets-confluence` for Confluence-specific features).

## Contributing

When adding new public plugins to this preset, ensure:

1. The plugin is from `@atlaskit/editor-plugin-*` or similar public packages
2. Plugin options are added to the `pluginOptions` type
3. Plugin order is maintained (some plugins have dependencies)
4. Tests are updated to reflect the new plugin

## License

Apache License 2.0
