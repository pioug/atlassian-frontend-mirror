import React from 'react';

import Button from '@atlaskit/button';
import { IconButton } from '@atlaskit/button/new';
import GrowDiagonalIcon from '@atlaskit/icon/core/grow-diagonal';
import ShrinkDiagonalIcon from '@atlaskit/icon/core/shrink-diagonal';
import LegacyMediaServicesActualSizeIcon from '@atlaskit/icon/glyph/media-services/actual-size';
import LegacyMediaServicesFitToPageIcon from '@atlaskit/icon/glyph/media-services/fit-to-page';
import { fg } from '@atlaskit/platform-feature-flags';
import { N50, N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { ExpandToggleContainer } from './styled';

// Atlaskit doesn't provide a circle variation of the expand/collapse icons so we have to implement our own
const ExpandCircleIcon = ({ isDisabled }: { isDisabled?: boolean }) => (
	<GrowDiagonalIcon
		label={''}
		LEGACY_size={'small'}
		color={isDisabled ? token('color.icon.disabled', N50) : token('color.icon', N500)}
		LEGACY_fallbackIcon={LegacyMediaServicesActualSizeIcon}
	/>
);

const CollapseCircleIcon = ({ isDisabled }: { isDisabled?: boolean }) => (
	<ShrinkDiagonalIcon
		label={''}
		LEGACY_size={'small'}
		color={isDisabled ? token('color.icon.disabled', N50) : token('color.icon', N500)}
		LEGACY_fallbackIcon={LegacyMediaServicesFitToPageIcon}
	/>
);

type Props = {
	editorId: string;
	expanded: boolean;
	isDisabled?: boolean;
	label: string;
	onClick: () => void;
};

export const BaseExpandToggle = ({ expanded, editorId, isDisabled, label, onClick }: Props) => {
	let Icon;

	if (expanded) {
		Icon = CollapseCircleIcon;
	} else {
		Icon = ExpandCircleIcon;
	}

	return fg('platform-component-visual-refresh') ? (
		<IconButton
			appearance={'subtle'}
			spacing="compact"
			aria-expanded={expanded}
			aria-controls={editorId}
			label={label}
			isDisabled={isDisabled}
			onClick={onClick}
			icon={expanded ? ShrinkDiagonalIcon : GrowDiagonalIcon}
		/>
	) : (
		<ExpandToggleContainer>
			<Button
				appearance={'subtle'}
				aria-expanded={expanded}
				aria-controls={editorId}
				aria-label={label}
				isDisabled={isDisabled}
				spacing={'none'}
				onClick={onClick}
				iconBefore={<Icon isDisabled={isDisabled} />}
			/>
		</ExpandToggleContainer>
	);
};
