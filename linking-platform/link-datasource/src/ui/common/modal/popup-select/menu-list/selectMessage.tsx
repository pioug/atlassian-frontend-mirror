import React from 'react';

import { cssMap } from '@compiled/react';
import { FormattedMessage, type MessageDescriptor } from 'react-intl-next';

import Heading from '@atlaskit/heading';
import { fg } from '@atlaskit/platform-feature-flags';
import { Flex, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import CustomSelectMessageOld from './selectMessageOld';

const styles = cssMap({
	boxStyles: {
		height: '64px',
		marginBottom: token('space.200'),
	},
	stackStyles: {
		paddingTop: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.150'),
		paddingRight: token('space.150'),
	},
});

interface CustomSelectMessageProps {
	icon: React.ReactNode;
	message: MessageDescriptor;
	testId: string;
}

const CustomSelectMessage = ({ icon, message, testId }: CustomSelectMessageProps) => {
	return (
		<Stack xcss={styles.stackStyles} testId={testId} alignInline="center">
			<Flex xcss={styles.boxStyles} alignItems="center" justifyContent="center">
				{icon}
			</Flex>
			<Heading size="xsmall">
				<FormattedMessage {...message} />
			</Heading>
		</Stack>
	);
};

export const CustomSelectMessageExported = (props: CustomSelectMessageProps) => {
	if (fg('bandicoots-compiled-migration-link-datasource')) {
		return <CustomSelectMessage {...props} />;
	} else {
		return <CustomSelectMessageOld {...props} />;
	}
};
export default CustomSelectMessageExported;
