/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import AKBadge from '@atlaskit/badge';
import { fg } from '@atlaskit/platform-feature-flags';

import AtlaskitBadgeOld from './AtlaskitBadgeOld';
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

const AtlaskitBadgeNew = ({
	value,
	name,
	className,
	testId = 'smart-element-atlaskit-badge',
}: AtlaskitBadgeProps) => {
	if (!value) {
		return null;
	}

	return (
		<span
			css={[badgeStyles]}
			data-fit-to-content
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

const AtlaskitBadge = (props: AtlaskitBadgeProps): JSX.Element | null => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <AtlaskitBadgeNew {...props} />;
	} else {
		return <AtlaskitBadgeOld {...props} />;
	}
};

export default AtlaskitBadge;
