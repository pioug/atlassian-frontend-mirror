import React from 'react';

import Button, { type ButtonProps } from '@atlaskit/button/new';
import { cssMap, cx } from '@atlaskit/css';
import { Box, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	integrationButtonCopyWrapperStyle: {
		display: 'flex',
		justifyContent: 'left',
		color: token('color.text'),
	},
	integrationIconWrapperStyle: {
		marginTop: token('space.025'),
		marginRight: token('space.100'),
		marginBottom: token('space.0'),
		marginLeft: token('space.0'),
	},
});

type Props = {
	IntegrationIcon: React.ComponentType;
	text: React.ReactNode;
} & Pick<ButtonProps, 'onClick'>;

const IntegrationButton: {
	(props: Props): React.JSX.Element;
	displayName: string;
} = (props: Props): React.JSX.Element => {
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
