import React from 'react';

import { FormattedMessage } from 'react-intl-next';

import Heading from '@atlaskit/heading';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';

import { messages } from '../i18n';

export type Props = {
	isExtendedShareDialogEnabled?: boolean;
	title?: React.ReactNode;
};
const headerWrapperStyles = xcss({
	display: 'flex',
	justifyContent: 'space-between',
	marginRight: 'space.400',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: 'space.400',
});

const headerWrapperExtraSpaceStyles = xcss({
	marginBottom: 'space.150',
	color: 'color.text',
});

export const ShareHeader = ({ isExtendedShareDialogEnabled, title }: Props): React.JSX.Element => {
	return (
		<Box
			xcss={[headerWrapperStyles, isExtendedShareDialogEnabled && headerWrapperExtraSpaceStyles]}
		>
			<Heading size="small" as="h2">
				{title || <FormattedMessage {...messages.formTitle} />}
			</Heading>
		</Box>
	);
};
