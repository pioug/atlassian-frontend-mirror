import React from 'react';

import { cssMap } from '@atlaskit/css';
import Icon from '@atlaskit/icon/core/text-style';
import { type NewCoreIconProps } from '@atlaskit/icon/types';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import { type IconColor } from '@atlaskit/tokens/css-type-schema';

type TextColorIconProps = NewCoreIconProps & {
	iconColor?: IconColor;
	isDisabled?: boolean;
};

const styles = cssMap({
	icon: {
		marginTop: token('space.075'),
	},
});

export const TextColorIcon = ({
	label,
	shouldRecommendSmallIcon,
	size,
	spacing,
	testId,
	iconColor,
	isDisabled,
}: TextColorIconProps) => {
	return (
		// for the moment the Icon is not truely centered - adding margin top as a workaround
		<Box as="span" xcss={styles.icon}>
			<Icon
				label={label}
				testId={testId}
				color={isDisabled ? token('color.icon.disabled') : iconColor}
				shouldRecommendSmallIcon={shouldRecommendSmallIcon}
				spacing={spacing}
				size={size}
			/>
		</Box>
	);
};
