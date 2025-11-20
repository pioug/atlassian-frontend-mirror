import React from 'react';

import { cssMap } from '@compiled/react';
import { FormattedMessage, useIntl } from 'react-intl-next';

import Avatar from '@atlaskit/avatar';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { USER_TYPE_TEST_ID } from '../../render-type/user';
import { userTypeMessages } from '../../render-type/user/messages';

const styles = cssMap({
	avatarWrapperStyles: {
		marginRight: token('space.100'),
	},
	emptyAvatarWrapperStyles: {
		display: 'flex',
		alignItems: 'center',
		font: token('font.body'),
		paddingBlock: token('space.050'),
		paddingInline: token('space.100'),
		opacity: '0',
		'&:hover': {
			opacity: '1',
		},
	},
});

export const EmptyAvatar = (): React.JSX.Element => {
	const intl = useIntl();
	return (
		<Tooltip content={intl.formatMessage(userTypeMessages.userDefaultdisplayNameValue)}>
			<Box xcss={styles.emptyAvatarWrapperStyles} testId={USER_TYPE_TEST_ID}>
				<Box xcss={styles.avatarWrapperStyles}>
					<Avatar appearance="circle" size={'small'} testId={`${USER_TYPE_TEST_ID}--avatar`} />
				</Box>
				<FormattedMessage {...userTypeMessages.userDefaultdisplayNameValue} />
			</Box>
		</Tooltip>
	);
};
