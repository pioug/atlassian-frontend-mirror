/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { Flex, Inline, Stack } from '@atlaskit/primitives/compiled';

// eslint-disable-next-line @atlaskit/platform/use-entrypoints-in-examples
import { allObjects } from '../src/components/object/all-objects';
// eslint-disable-next-line @atlaskit/platform/use-entrypoints-in-examples
import type { ObjectSize } from '../src/components/object/types';

const containerStyles = css({
	maxWidth: '600px',
});

export default function Objects() {
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
