/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@compiled/react';
import { type MessageDescriptor, useIntl } from 'react-intl-next';

import { fg } from '@atlaskit/platform-feature-flags';
import { Flex, Inline } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { NoInstancesViewOld } from './no-instances-old';
import { NoInstancesSvg } from './no-instances-svg';

const styles = cssMap({
	titleStyles: {
		font: token('font.heading.small'),
		marginTop: token('space.200'),
	},
	descriptionStyles: {
		marginTop: token('space.100'),
	},
	containerStyles: {
		marginTop: token('space.800'),
	},
});

interface NoInstanceViewProps {
	title: MessageDescriptor;
	description: MessageDescriptor;
	testId: string;
}

export const NoInstancesViewNew = ({ title, description, testId }: NoInstanceViewProps) => {
	const { formatMessage } = useIntl();
	return (
		<Flex testId={testId} direction="column" alignItems="center" xcss={styles.containerStyles}>
			<NoInstancesSvg />
			<Inline as="span" xcss={styles.titleStyles}>
				{formatMessage(title)}
			</Inline>
			<Inline as="span" xcss={styles.descriptionStyles}>
				{formatMessage(description)}
			</Inline>
		</Flex>
	);
};

export const NoInstancesView = (props: NoInstanceViewProps) => {
	if (fg('bandicoots-compiled-migration-link-datasource')) {
		return <NoInstancesViewNew {...props} />;
	} else {
		return <NoInstancesViewOld {...props} />;
	}
};
