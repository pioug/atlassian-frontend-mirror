import React from 'react';

import Heading from '@atlaskit/heading/heading';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Flex } from '@atlaskit/primitives/components/flex';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Text } from '@atlaskit/primitives/text';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { xcss } from '@atlaskit/primitives/xcss/xcss';

type EmptyStateProps = {
	description?: React.ReactNode;
	header: string;
	renderImage?: () => React.ReactNode;
	testId?: string;
};

const containerStyles = xcss({
	marginBlockStart: 'space.600',
	marginBlockEnd: 'space.600',
	textAlign: 'center',
});

export const EmptyState = ({
	testId,
	header,
	description,
	renderImage,
}: EmptyStateProps): React.JSX.Element => {
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
				<Heading size="medium" as="h2">
					{header}
				</Heading>
				{description && (
					<Text as="p" color="color.text">
						{description}
					</Text>
				)}
			</Flex>
		</Flex>
	);
};
