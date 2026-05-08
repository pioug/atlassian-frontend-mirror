import React from 'react';

import { cssMap } from '@atlaskit/css';
import QuestionCircleIcon from '@atlaskit/icon/core/question-circle';
import { Flex } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { SkeletonIconButton } from './components/SkeletonIconButton';
import { type SkeletonHelpButtonProps } from './skeleton-help-button';

const iconSpacingStyles = cssMap({
	space050: {
		paddingBlock: token('space.050'),
		paddingInline: token('space.050'),
	},
});

/**
 * __Nav 4 skeleton help button__
 *
 * A nav 4 skeleton help button {description}.
 */
export const Nav4SkeletonHelpButton = ({
	label = '',
}: SkeletonHelpButtonProps): React.JSX.Element => (
	<SkeletonIconButton>
		<Flex xcss={iconSpacingStyles.space050}>
			<QuestionCircleIcon label={label} color={token('color.icon')} />
		</Flex>
	</SkeletonIconButton>
);
