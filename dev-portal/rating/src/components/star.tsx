import React, { forwardRef, useCallback } from 'react';

import StarStarredIcon from '@atlaskit/icon/core/star-starred';
import StarUnstarredIcon from '@atlaskit/icon/core/star-unstarred';
import { Y200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import Rating, { type RatingProps, type RatingRender } from './rating';

export interface StarProps extends RatingProps {
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

const Star: React.ForwardRefExoticComponent<StarProps & React.RefAttributes<HTMLLabelElement>> = forwardRef<HTMLLabelElement, StarProps>(
	({ color = token('color.icon.accent.yellow', Y200), spacing = 'spacious', ...props }, ref) => {
		const render: RatingRender = useCallback(
			(props) => {
				return props.isChecked ? (
					// Labels are set inside Rating - blank them out here to not double up.
					<StarStarredIcon color={color as any} spacing={spacing} label="" />
				) : (
					// Labels are set inside Rating - blank them out here to not double up.
					<StarUnstarredIcon color={color as any} spacing={spacing} label="" />
				);
			},
			[color, spacing],
		);

		return <Rating {...props} ref={ref} render={render} />;
	},
);

export default Star;
