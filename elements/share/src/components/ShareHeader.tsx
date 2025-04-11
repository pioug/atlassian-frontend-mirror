import React from 'react';

import { FormattedMessage } from 'react-intl-next';

import Heading from '@atlaskit/heading';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, xcss } from '@atlaskit/primitives';

import { messages } from '../i18n';

export type Props = {
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

export const ShareHeader = ({ title }: Props) => {
	return (
		<Box xcss={headerWrapperStyles}>
			{fg('share-header-accessibility') ? (
				<Heading size="small" as="h2">
					{title || <FormattedMessage {...messages.formTitle} />}
				</Heading>
			) : (
				<Heading size="small">{title || <FormattedMessage {...messages.formTitle} />}</Heading>
			)}
		</Box>
	);
};
