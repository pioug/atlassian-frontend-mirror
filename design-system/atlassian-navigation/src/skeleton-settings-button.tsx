import React from 'react';

import Nav4SettingsIcon from '@atlaskit/icon/core/settings';
import SettingsIcon from '@atlaskit/icon/glyph/settings';
import { token } from '@atlaskit/tokens';

import { SkeletonIconButton } from './components/SkeletonIconButton';

export type SkeletonSettingsButtonProps = {
	/**
	 *  Describes the specific role of this navigation component for users viewing the page with a screen
	 *  reader. Use this to differentiate the buttons from other navigation buttons on a page.
	 */
	label: string;
};

/**
 * __Skeleton settings button__
 *
 * Skeleton buttons are lightweight HTML button elements with CSS that represent
 * their heavier interactive counterparts, for use when elements of the
 * navigation are loaded dynamically. This one represents the Settings button.
 *
 * - [Examples](https://atlassian.design/components/atlassian-navigation/examples#skeleton-button)
 * - [Code](https://atlassian.design/components/atlassian-navigation/code)
 */
export const SkeletonSettingsButton = ({ label = '' }: SkeletonSettingsButtonProps) => (
	<SkeletonIconButton>
		<SettingsIcon label={label} />
	</SkeletonIconButton>
);

/**
 * __Nav 4 skeleton settings button__
 *
 * A nav 4 skeleton settings button
 */
export const Nav4SkeletonSettingsButton = ({ label = '' }: SkeletonSettingsButtonProps) => (
	<SkeletonIconButton>
		<Nav4SettingsIcon label={label} color={token('color.icon')} />
	</SkeletonIconButton>
);
