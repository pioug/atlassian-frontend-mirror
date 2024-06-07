import React from 'react';

import Button from '@atlaskit/button';
import MediaServicesActualSizeIcon from '@atlaskit/icon/glyph/media-services/actual-size';
import MediaServicesFitToPageIcon from '@atlaskit/icon/glyph/media-services/fit-to-page';
import { N50, N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { ExpandToggleContainer } from './styled';

// Atlaskit doesn't provide a circle variation of the expand/collapse icons so we have to implement our own
const ExpandCircleIcon = ({ isDisabled }: { isDisabled?: boolean }) => (
	<MediaServicesActualSizeIcon
		label={''}
		size={'small'}
		primaryColor={isDisabled ? token('color.icon.disabled', N50) : token('color.icon', N500)}
	/>
);

const CollapseCircleIcon = ({ isDisabled }: { isDisabled?: boolean }) => (
	<MediaServicesFitToPageIcon
		label={''}
		size={'small'}
		primaryColor={isDisabled ? token('color.icon.disabled', N50) : token('color.icon', N500)}
	/>
);

type Props = {
	expanded: boolean;
	editorId: string;
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

	return (
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
