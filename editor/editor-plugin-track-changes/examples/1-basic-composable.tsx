import React from 'react';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { basePlugin } from '@atlaskit/editor-plugins/base';
import { blockTypePlugin } from '@atlaskit/editor-plugins/block-type';
import { listPlugin } from '@atlaskit/editor-plugins/list';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { trackChangesPlugin } from '../src/trackChangesPlugin';

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
	const { preset } = usePreset(
		(builder) =>
			builder.add(basePlugin).add(blockTypePlugin).add(listPlugin).add(trackChangesPlugin),
		[],
	);

	return (
		<Box xcss={styles.everythingContainer}>
			<Box xcss={styles.aboveEditor}>
				<Button appearance="primary">Show Diff</Button>
			</Box>
			<ComposableEditor preset={preset} />
		</Box>
	);
}

export default Editor;
