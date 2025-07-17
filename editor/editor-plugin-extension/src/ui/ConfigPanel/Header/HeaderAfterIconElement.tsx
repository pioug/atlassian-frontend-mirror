import React from 'react';

import type { ExtensionManifest } from '@atlaskit/editor-common/extensions';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Flex, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { withExtensionManifest } from '../withExtensionManifest';

const itemBodyStyles = xcss({
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'nowrap',
	justifyContent: 'space-between',
	margin: 'space.200',
	flexGrow: 3,
});

const itemTextStyles = xcss({
	maxWidth: '100%',
	whiteSpace: 'initial',
});

const summaryStyles = xcss({
	font: token('font.body.small'),
	color: 'color.text.subtlest',
	marginTop: 'space.050',
	whiteSpace: 'nowrap',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
});

type HeaderAfterIconElementProps = {
	extensionManifest: ExtensionManifest;
};
function HeaderAfterIconElement({ extensionManifest }: HeaderAfterIconElementProps) {
	const title = extensionManifest.title;
	const summary = extensionManifest.summary;

	return (
		<Box xcss={itemBodyStyles}>
			{summary ? (
				<Box xcss={itemTextStyles}>
					<div id="context-panel-title" data-testid="context-panel-title">
						{title}
					</div>
					<Box xcss={summaryStyles}>{summary}</Box>
				</Box>
			) : (
				<Flex direction="column" alignItems="center" testId="context-panel-title">
					{title}
				</Flex>
			)}
		</Box>
	);
}

export default withExtensionManifest(HeaderAfterIconElement);
