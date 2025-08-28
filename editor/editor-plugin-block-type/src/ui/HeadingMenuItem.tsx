import React from 'react';

import { useIntl } from 'react-intl-next';

import { blockTypeMessages } from '@atlaskit/editor-common/messages';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import TextHeadingFiveIcon from '@atlaskit/icon-lab/core/text-heading-five';
import TextHeadingFourIcon from '@atlaskit/icon-lab/core/text-heading-four';
import TextHeadingOneIcon from '@atlaskit/icon-lab/core/text-heading-one';
import TextHeadingSixIcon from '@atlaskit/icon-lab/core/text-heading-six';
import TextHeadingThreeIcon from '@atlaskit/icon-lab/core/text-heading-three';
import TextHeadingTwoIcon from '@atlaskit/icon-lab/core/text-heading-two';

const headingIcons = [
	TextHeadingOneIcon,
	TextHeadingTwoIcon,
	TextHeadingThreeIcon,
	TextHeadingFourIcon,
	TextHeadingFiveIcon,
	TextHeadingSixIcon,
];

const headingMessages = [
	blockTypeMessages.heading1,
	blockTypeMessages.heading2,
	blockTypeMessages.heading3,
	blockTypeMessages.heading4,
	blockTypeMessages.heading5,
	blockTypeMessages.heading6,
];

type HeadingMenuItemProps = {
	level: 1 | 2 | 3 | 4 | 5 | 6;
};

export const HeadingMenuItem = ({ level }: HeadingMenuItemProps) => {
	const { formatMessage } = useIntl();
	const Icon = headingIcons[level - 1];
	const message = headingMessages[level - 1];

	return (
		<ToolbarDropdownItem elemBefore={<Icon label={formatMessage(message)} />}>
			{formatMessage(message)}
		</ToolbarDropdownItem>
	);
};
