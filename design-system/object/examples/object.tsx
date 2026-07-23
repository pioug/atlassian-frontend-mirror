/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading/heading';
import type { ObjectProps } from '@atlaskit/object/types';
import { Flex } from '@atlaskit/primitives/compiled/flex';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';

import { allObjects } from '../examples-utils/all-objects';

type ObjectSize = NonNullable<ObjectProps['size']>;

const containerStyles = css({
	maxWidth: '600px',
});

export default function Objects(): JSX.Element {
	const sizes: ObjectSize[] = ['small', 'medium'];

	return (
		<div css={containerStyles}>
			<Flex gap="space.300" wrap="wrap">
				{allObjects.map((ObjectComponent) => {
					const objectName = ObjectComponent.name;

					return (
						<Stack key={objectName} space="space.100">
							<Heading size="xsmall">{objectName}</Heading>
							<Inline space="space.150" alignBlock="center">
								{sizes.map((size) => (
									<ObjectComponent key={`${objectName}-${size}`} size={size} />
								))}
							</Inline>
						</Stack>
					);
				})}
			</Flex>
		</div>
	);
}
