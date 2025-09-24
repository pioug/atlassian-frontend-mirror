/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { Flex, Inline, Stack } from '@atlaskit/primitives/compiled';

// eslint-disable-next-line @atlaskit/platform/use-entrypoints-in-examples
import { allObjectTiles } from '../examples-utils/all-object-tiles';
// eslint-disable-next-line @atlaskit/platform/use-entrypoints-in-examples
import type { ObjectTileSize } from '../src/components/object-tile/types';

const containerStyles = css({
	maxWidth: '980px',
});

export default function ObjectTiles() {
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
