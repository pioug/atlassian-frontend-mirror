/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import AKBadge from '@atlaskit/badge';
import { fg } from '@atlaskit/platform-feature-flags';

import { ElementProps } from '../index';

export type AtlaskitBadgeElementProps = ElementProps & {
	value?: number;
};

const badgeStylesOld = css({
	alignItems: 'center',
	display: 'inline-flex',
});

const badgeStyles = css({
	alignItems: 'center',
	display: 'inline-flex',
	minWidth: 'fit-content',
});

/**
 * A base element that displays a visual indicator for a numeric value
 * @internal
 * @see StoryPoints
 * */

const AtlaskitElementBadge = ({
	value,
	name,
	className,
	testId = 'smart-element-atlaskit-badge',
}: AtlaskitBadgeElementProps) => {
	if (!value) {
		return null;
	}

	return (
		<span
			css={[
				!fg('platform-linking-visual-refresh-v1') && badgeStylesOld,
				fg('platform-linking-visual-refresh-v1') && badgeStyles,
			]}
			{...(fg('platform-linking-visual-refresh-v1') ? {} : { ['data-fit-to-content']: true })}
			data-smart-element={name}
			data-smart-element-atlaskit-badge
			data-testid={testId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={className}
		>
			<AKBadge>{value}</AKBadge>
		</span>
	);
};

export default AtlaskitElementBadge;
