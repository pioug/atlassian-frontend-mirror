import React from 'react';

import { cssMap } from '@compiled/react';
import { FormattedMessage, type MessageDescriptor } from 'react-intl-next';

import Heading from '@atlaskit/heading';
import { fg } from '@atlaskit/platform-feature-flags';
import { Flex, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	boxStylesOld: {
		height: '64px',
		marginBottom: token('space.200'),
	},
	boxStyles: {
		height: '96px',
	},
	stackStylesOld: {
		paddingTop: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.150'),
		paddingRight: token('space.150'),
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
	icon: React.ReactNode;
	message: MessageDescriptor;
	/**
	 * This attribute is only consumed when the fg `platform-linking-visual-refresh-sllv` is
	 * enabled.
	 */
	description?: MessageDescriptor;
	testId: string;
}

const CustomSelectMessage = ({ icon, message, description, testId }: CustomSelectMessageProps) => {
	if (fg('platform-linking-visual-refresh-sllv')) {
		return (
			<Stack xcss={styles.stackStyles} testId={testId} alignInline="center">
				<Flex xcss={styles.boxStyles} alignItems="center" justifyContent="center">
					{icon}
				</Flex>
				<Heading size="small">
					<FormattedMessage {...message} />
				</Heading>
				{description && (
					<Text size="medium">
						<FormattedMessage {...description} />
					</Text>
				)}
			</Stack>
		);
	}

	return (
		<Stack xcss={styles.stackStylesOld} testId={testId} alignInline="center">
			<Flex xcss={styles.boxStylesOld} alignItems="center" justifyContent="center">
				{icon}
			</Flex>
			<Heading size="xsmall">
				<FormattedMessage {...message} />
			</Heading>
		</Stack>
	);
};

export default CustomSelectMessage;
