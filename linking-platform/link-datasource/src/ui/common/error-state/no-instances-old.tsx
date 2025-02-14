/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { type MessageDescriptor, useIntl } from 'react-intl-next';

import { Flex, Inline, xcss } from '@atlaskit/primitives';

import { NoInstancesSvg } from './no-instances-svg';

const titleStyles = xcss({
	font: 'font.heading.small',
	marginTop: 'space.200',
});

const descriptionStyles = xcss({
	marginTop: 'space.100',
});

const containerStyles = xcss({
	marginTop: 'space.800',
});

interface NoInstanceViewProps {
	title: MessageDescriptor;
	description: MessageDescriptor;
	testId: string;
}

export const NoInstancesViewOld = ({ title, description, testId }: NoInstanceViewProps) => {
	const { formatMessage } = useIntl();
	return (
		<Flex testId={testId} direction="column" alignItems="center" xcss={containerStyles}>
			<NoInstancesSvg />
			<Inline as="span" xcss={titleStyles}>
				{formatMessage(title)}
			</Inline>
			<Inline as="span" xcss={descriptionStyles}>
				{formatMessage(description)}
			</Inline>
		</Flex>
	);
};
