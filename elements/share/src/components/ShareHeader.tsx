import React from 'react';

import { FormattedMessage } from 'react-intl-next';

import Heading from '@atlaskit/heading';
import { fg } from '@atlaskit/platform-feature-flags';
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
	marginBottom: 'space.200',
});

export const ShareHeader = ({ isExtendedShareDialogEnabled, title }: Props) => {
	const headingSize = isExtendedShareDialogEnabled ? 'medium' : 'small';

	return (
		<Box
			xcss={[headerWrapperStyles, isExtendedShareDialogEnabled && headerWrapperExtraSpaceStyles]}
		>
			{fg('share-header-accessibility') ? (
				<Heading size={headingSize} as="h2">
					{title || <FormattedMessage {...messages.formTitle} />}
				</Heading>
			) : (
				<Heading size={headingSize}>
					{title || <FormattedMessage {...messages.formTitle} />}
				</Heading>
			)}
		</Box>
	);
};
