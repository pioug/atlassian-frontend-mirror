import React from 'react';

import Heading from '@atlaskit/heading';
import { Box, Flex, xcss } from '@atlaskit/primitives';

type EmptyStateProps = {
	header: string;
	testId?: string;
	description?: React.ReactNode;
	renderImage?: () => React.ReactNode;
};

export const EmptyState = ({ testId, header, description, renderImage }: EmptyStateProps) => {
	return (
		<Flex
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			xcss={xcss({
				marginBlockStart: 'space.600',
				marginBlockEnd: 'space.600',
				textAlign: 'center',
			})}
			testId={testId}
			direction="column"
			alignItems="center"
			gap="space.100"
		>
			{renderImage?.()}
			<Heading size="medium">{header}</Heading>
			{description && (
				<Box as="p" color={'color.text'}>
					{description}
				</Box>
			)}
		</Flex>
	);
};
