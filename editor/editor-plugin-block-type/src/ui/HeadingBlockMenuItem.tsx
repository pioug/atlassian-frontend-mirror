import React from 'react';

import { useIntl } from 'react-intl-next';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { blockTypeMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import TextHeadingFiveIcon from '@atlaskit/icon-lab/core/text-heading-five';
import TextHeadingFourIcon from '@atlaskit/icon-lab/core/text-heading-four';
import TextHeadingOneIcon from '@atlaskit/icon-lab/core/text-heading-one';
import TextHeadingSixIcon from '@atlaskit/icon-lab/core/text-heading-six';
import TextHeadingThreeIcon from '@atlaskit/icon-lab/core/text-heading-three';
import TextHeadingTwoIcon from '@atlaskit/icon-lab/core/text-heading-two';
import { fg } from '@atlaskit/platform-feature-flags';

import type { BlockTypePlugin } from '../blockTypePluginType';

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

const NODE_NAME = 'heading';

const HeadingBlockMenuItem = ({ level, api }: HeadingBlockMenuItemProps) => {
	const { formatMessage } = useIntl();
	const Icon = headingIcons[level - 1];
	const message = headingMessages[level - 1];

	const handleClick = (event: React.MouseEvent | React.KeyboardEvent) => {
		const triggeredFrom =
			event.nativeEvent instanceof KeyboardEvent || event.nativeEvent.detail === 0
				? INPUT_METHOD.KEYBOARD
				: INPUT_METHOD.MOUSE;
		const inputMethod = INPUT_METHOD.BLOCK_MENU;

		api?.core.actions.execute(({ tr }) => {
			const command = api?.blockMenu?.commands.transformNode(tr.doc.type.schema.nodes.heading, {
				inputMethod,
				triggeredFrom,
				targetTypeName: `${NODE_NAME}${level}`,
				targetAttrs: { level },
			});
			return command ? command({ tr }) : null;
		});
	};

	// [FEATURE FLAG: platform_editor_block_menu_v2_patch_3]
	// Adds size="small" to icons for better visual consistency in block menu.
	// To clean up: remove conditional, keep only size="small" version.
	const iconSize = fg('platform_editor_block_menu_v2_patch_3') ? 'small' : undefined;

	return (
		<ToolbarDropdownItem onClick={handleClick} elemBefore={<Icon label="" size={iconSize} />}>
			{formatMessage(message)}
		</ToolbarDropdownItem>
	);
};

export const createHeadingBlockMenuItem = ({ level, api }: HeadingBlockMenuItemProps) => {
	return (): React.JSX.Element => <HeadingBlockMenuItem level={level} api={api} />;
};
