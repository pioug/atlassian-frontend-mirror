import React from 'react';

import { useIntl } from 'react-intl';

import { messages } from '@atlaskit/editor-common/messages/table';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives/box';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Inline } from '@atlaskit/primitives/inline';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { xcss } from '@atlaskit/primitives/xcss/xcss';
import { token } from '@atlaskit/tokens';

const tableFullWidthLabelWrapperStyles = xcss({
	height: token('space.400'),
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

export const FullWidthDisplay = (): React.JSX.Element => {
	const { formatMessage } = useIntl();
	return (
		<Box xcss={tableFullWidthLabelWrapperStyles}>
			<Inline xcss={tableFullWidthLabelStyles}>{formatMessage(messages.fullWidthLabel)}</Inline>
		</Box>
	);
};
