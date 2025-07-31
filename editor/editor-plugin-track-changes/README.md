# Editor plugin track changes

Track changes plugin for @atlaskit/editor-core

## Usage

`import { trackChangesPlugin } from '@atlaskit/editor-plugin-track-changes';`

### Dependencies

**Required:**
- `ShowDiffPlugin` - Required for displaying track changes diff view

**Optional:**
- `PrimaryToolbarPlugin` - Required if using `showOnToolbar: true`

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
