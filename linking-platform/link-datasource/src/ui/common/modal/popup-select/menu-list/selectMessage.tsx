import React from 'react';

import { cssMap } from '@compiled/react';
import { FormattedMessage, type MessageDescriptor } from 'react-intl-next';

import Heading from '@atlaskit/heading';
import { Flex, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	boxStyles: {
		height: '96px',
	},
	stackStyles: {
		gap: token('space.200'),
		paddingTop: token('space.500'),
		paddingBottom: token('space.500'),
		paddingLeft: token('space.600'),
		paddingRight: token('space.600'),
		textAlign: 'center',
	},
});

interface CustomSelectMessageProps {
	description?: MessageDescriptor;
	icon: React.ReactNode;
	message: MessageDescriptor;
	testId: string;
}

const CustomSelectMessage = ({ icon, message, description, testId }: CustomSelectMessageProps) => {
	return (
		<Stack xcss={styles.stackStyles} testId={testId} alignInline="center">
			<Flex xcss={styles.boxStyles} alignItems="center" justifyContent="center">
				{icon}
			</Flex>
			<Heading size="small" as="h2">
				<FormattedMessage {...message} />
			</Heading>
			{description && (
				<Text size="medium">
					<FormattedMessage {...description} />
				</Text>
			)}
		</Stack>
	);
};

export default CustomSelectMessage;
