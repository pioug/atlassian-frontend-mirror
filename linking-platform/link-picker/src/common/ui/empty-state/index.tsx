import React from 'react';

import Heading from '@atlaskit/heading';
import { Flex, Text, xcss } from '@atlaskit/primitives';

type EmptyStateProps = {
	header: string;
	testId?: string;
	description?: React.ReactNode;
	renderImage?: () => React.ReactNode;
};

const containerStyles = xcss({
	marginBlockStart: 'space.600',
	marginBlockEnd: 'space.600',
	textAlign: 'center',
});

export const EmptyState = ({ testId, header, description, renderImage }: EmptyStateProps) => {
	return (
		<Flex
			xcss={containerStyles}
			testId={testId}
			direction="column"
			alignItems="center"
			gap="space.300"
		>
			{renderImage?.()}
			<Flex direction="column" alignItems="center" gap="space.200">
				<Heading size="medium">{header}</Heading>
				{description && (
					<Text as="p" color="color.text">
						{description}
					</Text>
				)}
			</Flex>
		</Flex>
	);
};
