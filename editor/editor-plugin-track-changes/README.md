# Editor Plugin Track Changes

Track changes plugin for @atlaskit/editor-core

## Overview

The Track Changes plugin enables tracking and display of document changes in the Atlassian Editor. It integrates with the Show Diff plugin to visualize content modifications and provides commands to toggle the display of changes and reset the baseline for comparison.

## Key features

- **Toggle change display** - Show or hide tracked changes in the editor using the `toggleChanges` command
- **Baseline reset** - Reset the baseline used for tracking changes with the `resetBaseline` command
- **Toolbar integration** - Optionally display a track changes button in the editor toolbar
- **Shared state** - Access the state of change display and diff availability through shared plugin state
- **Show Diff integration** - Works seamlessly with the Show Diff plugin for visual change representation

## Install

- **Install** - `yarn add @atlaskit/editor-plugin-track-changes`
- **npm** - [@atlaskit/editor-plugin-track-changes](https://www.npmjs.com/package/@atlaskit/editor-plugin-track-changes)
- **Source** - [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-track-changes)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-track-changes/dist/)

## Usage

### Import

`import { trackChangesPlugin } from '@atlaskit/editor-plugin-track-changes';`

### Dependencies

**Required:**
- `ShowDiffPlugin` - Required for displaying track changes diff view

**Optional:**
- `PrimaryToolbarPlugin` - Required if using `showOnToolbar: true`
- `ToolbarPlugin` - Alternative toolbar plugin for registering the track changes button

### Configuration

The plugin accepts an optional configuration object:

```typescript
trackChangesPlugin({
  showOnToolbar: true // Shows track changes button in the toolbar (default: false)
})
```

### Example

```typescript
import React from 'react';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { basePlugin } from '@atlaskit/editor-plugins/base';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { showDiffPlugin } from '@atlaskit/editor-plugin-show-diff';
import { trackChangesPlugin } from '@atlaskit/editor-plugin-track-changes';

const styles = cssMap({
	aboveEditor: {
		paddingTop: token('space.100'),
		paddingBottom: token('space.100'),
	},
	everythingContainer: {
		paddingTop: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
		paddingRight: token('space.200'),
	},
});

function Editor() {
	const { preset, editorApi } = usePreset(
		(builder) =>
			builder.add(basePlugin).add(showDiffPlugin).add(trackChangesPlugin),
		[],
	);

	const isSelected = useSharedPluginStateSelector(editorApi, 'trackChanges.isDisplayingChanges');

	return (
		<Box xcss={styles.everythingContainer}>
			<Box xcss={styles.aboveEditor}>
				<Button
					appearance="primary"
					onClick={() => {
						editorApi?.core.actions.execute(
							editorApi?.trackChanges.commands.toggleChanges,
						);
					}}
					isSelected={isSelected}
				>
					Show Diff
				</Button>
			</Box>
			<ComposableEditor preset={preset} />
		</Box>
	);
}

export default Editor;
```

Detailed docs and example usage can be found [here](https://atlaskit.atlassian.com/packages/editor/editor-plugin-track-changes).

## Support

For support, visit the [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) Slack channel or submit an issue via [go/editor-help](https://go/editor-help).

## License

Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
