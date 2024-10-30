import React from 'react';

import QuestionCircleIcon from '@atlaskit/icon/core/migration/question-circle';
import Nav4QuestionCircleIcon from '@atlaskit/icon/core/question-circle';
import { token } from '@atlaskit/tokens';

import { SkeletonIconButton } from './components/SkeletonIconButton';
import { useTheme } from './theme';

export type SkeletonHelpButtonProps = {
	/**
	 *  Describes the specific role of this navigation component for users viewing the page with a screen
	 *  reader. Use this to differentiate the buttons from other navigation buttons on a page.
	 */
	label: string;
};

/**
 * __Skeleton notification button__
 *
 * Skeleton buttons are lightweight HTML button elements with CSS that represent
 * their heavier interactive counterparts, for use when elements of the
 * navigation are loaded dynamically. This one represents the Help button.
 *
 * - [Examples](https://atlassian.design/components/atlassian-navigation/examples#skeleton-button)
 * - [Code](https://atlassian.design/components/atlassian-navigation/code)
 */
export const SkeletonHelpButton = ({ label = '' }: SkeletonHelpButtonProps) => {
	const {
		mode: { navigation },
	} = useTheme();

	return (
		<SkeletonIconButton>
			<QuestionCircleIcon
				label={label}
				color="currentColor"
				LEGACY_secondaryColor={navigation.backgroundColor}
			/>
		</SkeletonIconButton>
	);
};

/**
 * __Nav 4 skeleton help button__
 *
 * A nav 4 skeleton help button {description}.
 */
export const Nav4SkeletonHelpButton = ({ label = '' }: SkeletonHelpButtonProps) => (
	<SkeletonIconButton>
		<Nav4QuestionCircleIcon label={label} spacing="spacious" color={token('color.icon')} />
	</SkeletonIconButton>
);
