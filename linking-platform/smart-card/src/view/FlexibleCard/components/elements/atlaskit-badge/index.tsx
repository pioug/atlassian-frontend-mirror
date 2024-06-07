/** @jsx jsx */
import React from 'react';
import AKBadge from '@atlaskit/badge';
import { css, jsx } from '@emotion/react';
import { type AtlaskitBadgeProps } from './types';

const badgeStyles = css({
	alignItems: 'center',
	display: 'inline-flex',
});

/**
 * A base element that displays a visual indicator for a numeric value
 * @internal
 * @see StoryPoints
 * */

const AtlaskitBadge: React.FC<AtlaskitBadgeProps> = ({
	value,
	name,
	overrideCss,
	testId = 'smart-element-atlaskit-badge',
}) => {
	if (!value) {
		return null;
	}

	return (
		<span
			css={[badgeStyles, overrideCss]}
			data-fit-to-content
			data-smart-element={name}
			data-smart-element-atlaskit-badge
			data-testid={testId}
		>
			<AKBadge>{value}</AKBadge>
		</span>
	);
};

export default AtlaskitBadge;
