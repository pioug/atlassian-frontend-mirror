/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading/heading';
import type { ObjectTileProps } from '@atlaskit/object/types';
import { Flex } from '@atlaskit/primitives/compiled/flex';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';

import { allObjectTiles } from '../examples-utils/all-object-tiles';

type ObjectTileSize = NonNullable<ObjectTileProps['size']>;

const containerStyles = css({
	maxWidth: '980px',
});

export default function ObjectTiles(): JSX.Element {
	const sizes: ObjectTileSize[] = ['xsmall', 'small', 'medium', 'large', 'xlarge'];

	return (
		<div css={containerStyles}>
			<Flex gap="space.400" wrap="wrap">
				{allObjectTiles.map((ObjectTileComponent) => {
					const objectName = ObjectTileComponent.name;

					return (
						<Stack key={objectName} space="space.100">
							<Heading size="medium">{objectName}</Heading>
							<Inline space="space.200" alignBlock="center">
								{sizes.flatMap((size) => [
									<ObjectTileComponent
										key={`${objectName}-${size}-normal`}
										size={size}
										isBold={false}
									/>,
									<ObjectTileComponent
										key={`${objectName}-${size}-bold`}
										size={size}
										isBold={true}
									/>,
								])}
							</Inline>
						</Stack>
					);
				})}
			</Flex>
		</div>
	);
}
