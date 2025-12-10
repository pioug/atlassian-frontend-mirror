import React from 'react';

import { useIntl } from 'react-intl-next';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { blockTypeMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import TextHeadingFiveIcon from '@atlaskit/icon-lab/core/text-heading-five';
import TextHeadingFourIcon from '@atlaskit/icon-lab/core/text-heading-four';
import TextHeadingOneIcon from '@atlaskit/icon-lab/core/text-heading-one';
import TextHeadingSixIcon from '@atlaskit/icon-lab/core/text-heading-six';
import TextHeadingThreeIcon from '@atlaskit/icon-lab/core/text-heading-three';
import TextHeadingTwoIcon from '@atlaskit/icon-lab/core/text-heading-two';

import type { BlockTypePlugin } from '../blockTypePluginType';

import { HEADING_2, HEADING_5, HEADING_1, HEADING_3, HEADING_4, HEADING_6 } from './consts';

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

type HeadingBlockMenuItemProps = {
	api: ExtractInjectionAPI<BlockTypePlugin> | undefined;
	level: 1 | 2 | 3 | 4 | 5 | 6;
};

const HeadingBlockTypes = [HEADING_1, HEADING_2, HEADING_3, HEADING_4, HEADING_5, HEADING_6];

const HeadingBlockMenuItem = ({ level, api }: HeadingBlockMenuItemProps) => {
	const { formatMessage } = useIntl();
	const Icon = headingIcons[level - 1];
	const message = headingMessages[level - 1];
	const currentBlockType = useSharedPluginStateSelector(api, 'blockType.currentBlockType');
	const selection = useSharedPluginStateSelector(api, 'selection.selection');
	const isTextSelection = selection instanceof TextSelection;
	const isHeading =
		isTextSelection && currentBlockType && HeadingBlockTypes.includes(currentBlockType);
	const currentHeadingLevel = isHeading ? currentBlockType.level : undefined;
	const isSelected = isHeading && currentHeadingLevel === level;

	const handleClick = (event: React.MouseEvent | React.KeyboardEvent) => {
		if (!selection) {
			return;
		}

		if (!isSelected) {
			const triggeredFrom =
				event.nativeEvent instanceof KeyboardEvent || event.nativeEvent.detail === 0
					? INPUT_METHOD.KEYBOARD
					: INPUT_METHOD.MOUSE;
			const inputMethod = INPUT_METHOD.BLOCK_MENU;

			api?.core.actions.execute(({ tr }) => {
				const command = api?.blockMenu?.commands.transformNode(tr.doc.type.schema.nodes.heading, {
					inputMethod,
					triggeredFrom,
					targetTypeName: `heading${level}`,
				});
				return command ? command({ tr }) : null;
			});
		}
	};

	return (
		<ToolbarDropdownItem
			onClick={handleClick}
			isSelected={isSelected}
			elemBefore={<Icon label="" />}
		>
			{formatMessage(message)}
		</ToolbarDropdownItem>
	);
};

export const createHeadingBlockMenuItem = ({ level, api }: HeadingBlockMenuItemProps) => {
	return (): React.JSX.Element => <HeadingBlockMenuItem level={level} api={api} />;
};
