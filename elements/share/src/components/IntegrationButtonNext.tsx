import React from 'react';

import Button, { type ButtonProps } from '@atlaskit/button/new';
import { cssMap, cx } from '@atlaskit/css';
import { Box, Text } from '@atlaskit/primitives/compiled';
import { N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	integrationButtonCopyWrapperStyle: {
		display: 'flex',
		justifyContent: 'left',
		color: token('color.text', N500),
	},
	integrationIconWrapperStyle: {
		marginTop: token('space.025', '2px'),
		marginRight: token('space.100', '8px'),
		marginBottom: token('space.0', '0px'),
		marginLeft: token('space.0', '0px'),
	},
});

type Props = {
	IntegrationIcon: React.ComponentType;
	text: React.ReactNode;
} & Pick<ButtonProps, 'onClick'>;

const IntegrationButton = (props: Props) => {
	const { text, IntegrationIcon } = props;
	return (
		<Button appearance="subtle" shouldFitContainer onClick={props.onClick}>
			<Box as="span" xcss={cx(styles.integrationButtonCopyWrapperStyle)}>
				<Box as="span" xcss={cx(styles.integrationIconWrapperStyle)}>
					<IntegrationIcon />
				</Box>
				<Text color="color.text">{text}</Text>
			</Box>
		</Button>
	);
};

IntegrationButton.displayName = 'IntegrationButton';

export default IntegrationButton;
