import React, { forwardRef, useCallback } from 'react';

import StarStarredIcon from '@atlaskit/icon/core/migration/star-starred--star-filled';
import StarUnstarredIcon from '@atlaskit/icon/core/migration/star-unstarred--star';
import { Y200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import Rating, { type RatingProps, type RatingRender } from './rating';

export interface StarProps extends RatingProps {
	/**
   * Size of the star icon.

   * Defaults to `"large"`.
   */
	size?: 'small' | 'medium' | 'large' | 'xlarge';

	/**
   * Color of the star icon,
   * when wanting to customize the color please ensure you use `colors` from `@atlaskit/theme`.

   * Defaults to `colors.Y200`.
   */
	color?: string;

	/**
	 * Spacing between the star and the text.
	 *
	 * Defaults to `"spacious"`.
	 */
	spacing?: 'none' | 'spacious';
}

const Star = forwardRef<HTMLLabelElement, StarProps>(
	(
		{
			size = 'large',
			color = token('color.icon.accent.yellow', Y200),
			spacing = 'spacious',
			...props
		},
		ref,
	) => {
		const render: RatingRender = useCallback(
			(props) => {
				return props.isChecked ? (
					// Labels are set inside Rating - blank them out here to not double up.
					<StarStarredIcon
						LEGACY_size={size}
						LEGACY_primaryColor={color}
						color={color as any}
						spacing={spacing}
						label=""
					/>
				) : (
					// Labels are set inside Rating - blank them out here to not double up.
					<StarUnstarredIcon
						LEGACY_size={size}
						LEGACY_primaryColor={color}
						color={color as any}
						spacing={spacing}
						label=""
					/>
				);
			},
			[color, size, spacing],
		);

		return <Rating {...props} ref={ref} render={render} />;
	},
);

export default Star;
