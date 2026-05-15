import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import { type IconTileProps } from '../../types';

import IconTileNew from './icon-tile';
import IconTileOld from './icon-tile-old';

/**
 * __IconTile__
 *
 * An icon with background shape, color, and size properties determined by Tile.
 */
export default function IconTile(props: IconTileProps): React.JSX.Element {
	if (
		props.shape === 'circle' &&
		(fg('platform_dst_icon_tile_circle_replacement') ||
			fg('platform_dst_icon_tile_circle_replacement_stage2'))
	) {
		return props.UNSAFE_circleReplacementComponent;
	} else if (props.shape === 'circle') {
		return (
			<IconTileOld
				appearance={props.appearance}
				icon={props.icon}
				label={props.label}
				shape={'circle'}
				size={props.size}
				testId={props.testId}
				UNSAFE_circleReplacementComponent={props.UNSAFE_circleReplacementComponent}
			/>
		);
	} else {
		return (
			<IconTileNew
				appearance={props.appearance}
				icon={props.icon}
				label={props.label}
				shape={props.shape}
				size={props.size}
				testId={props.testId}
			/>
		);
	}
}
