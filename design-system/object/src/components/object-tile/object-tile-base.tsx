import React from 'react';

import invariant from 'tiny-invariant';

import type { NewIconProps } from '@atlaskit/icon';
import Tile, { type TileProps } from '@atlaskit/tile';

import { type ObjectTileProps, type ObjectTileSize } from './types';

type ObjectTileBaseProps = ObjectTileProps & {
	icon: React.ComponentType<NewIconProps>;
	color: NewIconProps['color'];
	backgroundColor: TileProps['backgroundColor'];
};

/**
 * __Object tile base__
 *
 * An object tile represents an Atlassian-specific content type.
 *
 */
export default function ObjectTileBase({
	label = '',
	size = 'medium',
	testId,
	color,
	backgroundColor,
	icon: Icon,
}: ObjectTileBaseProps) {
	// Validate that size is a valid `ObjectTileSize` (and won't allow Tile's `xxsmall` size to be passed)
	const validSizes: ObjectTileSize[] = ['xsmall', 'small', 'medium', 'large', 'xlarge'];
	invariant(
		validSizes.includes(size),
		`ObjectTile: size "${size}" is not valid. Valid sizes are: ${validSizes.join(', ')}`,
	);

	return (
		<Tile label="" backgroundColor={backgroundColor} size={size}>
			<Icon
				label={label}
				color={color}
				testId={testId}
				// @ts-expect-error - Internal, undocumented prop
				shouldScale
			/>
		</Tile>
	);
}
