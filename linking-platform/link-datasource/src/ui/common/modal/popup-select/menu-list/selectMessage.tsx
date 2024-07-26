import React from 'react';

import { FormattedMessage, type MessageDescriptor } from 'react-intl-next';

import Heading from '@atlaskit/heading';
import { Flex, Stack, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

const boxStyles = xcss({
	height: token('space.800', '64px'),
	marginBottom: 'space.200',
});

const stackStyles = xcss({
	paddingTop: 'space.100',
	paddingBottom: 'space.100',
	paddingLeft: 'space.150',
	paddingRight: 'space.150',
});

interface CustomSelectMessageProps {
	icon: React.ReactNode;
	message: MessageDescriptor;
	testId: string;
}

const CustomSelectMessage = ({ icon, message, testId }: CustomSelectMessageProps) => {
	return (
		<Stack xcss={stackStyles} testId={testId} alignInline="center">
			<Flex xcss={boxStyles} alignItems="center" justifyContent="center">
				{icon}
			</Flex>
			<Heading size="xsmall">
				<FormattedMessage {...message} />
			</Heading>
		</Stack>
	);
};

export default CustomSelectMessage;
