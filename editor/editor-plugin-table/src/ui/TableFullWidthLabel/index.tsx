import React from 'react';

import { useIntl } from 'react-intl-next';

import { tableMessages as messages } from '@atlaskit/editor-common/messages';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Inline, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

const tableFullWidthLabelWrapperStyles = xcss({
	height: token('space.400', '32px'),
	display: 'flex',
	backgroundColor: 'elevation.surface.overlay',
	borderRadius: 'radius.small',
	boxShadow: 'elevation.shadow.overlay',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: 1,
	boxSizing: 'border-box',
	alignItems: 'center',
});

const tableFullWidthLabelStyles = xcss({
	marginLeft: 'space.100',
	marginRight: 'space.100',
	paddingLeft: 'space.075',
	paddingRight: 'space.075',
	paddingTop: 'space.050',
	paddingBottom: 'space.050',
});

export const FullWidthDisplay = () => {
	const { formatMessage } = useIntl();
	return (
		<Box xcss={tableFullWidthLabelWrapperStyles}>
			<Inline xcss={tableFullWidthLabelStyles}>{formatMessage(messages.fullWidthLabel)}</Inline>
		</Box>
	);
};
