import React from 'react';

import { FormattedMessage, useIntl } from 'react-intl-next';

import Avatar from '@atlaskit/avatar';
import { Box, xcss } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

import { USER_TYPE_TEST_ID } from '../../render-type/user';
import { userTypeMessages } from '../../render-type/user/messages';

const userWrapperStyles = xcss({
	display: 'flex',
	alignItems: 'center',
	font: 'font.body',
});

const avatarWrapperStyles = xcss({
	marginRight: 'space.100',
});

const emptyAvatarWrapperStyles = xcss({
	paddingBlock: 'space.050',
	paddingInline: 'space.100',
	opacity: 0,
	':hover': {
		opacity: 1,
	},
});

export const EmptyAvatarOld = () => {
	const intl = useIntl();
	return (
		<Tooltip content={intl.formatMessage(userTypeMessages.userDefaultdisplayNameValue)}>
			<Box xcss={[userWrapperStyles, emptyAvatarWrapperStyles]} testId={USER_TYPE_TEST_ID}>
				<Box xcss={avatarWrapperStyles}>
					<Avatar appearance="circle" size={'small'} testId={`${USER_TYPE_TEST_ID}--avatar`} />
				</Box>
				<FormattedMessage {...userTypeMessages.userDefaultdisplayNameValue} />
			</Box>
		</Tooltip>
	);
};
