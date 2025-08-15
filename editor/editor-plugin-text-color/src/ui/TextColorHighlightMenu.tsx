import React from 'react';

import { useIntl } from 'react-intl-next';

import { cssMap } from '@atlaskit/css';
import { textColorMessages as messages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { TextColorIcon, ToolbarColorSwatch, ToolbarDropdownMenu } from '@atlaskit/editor-toolbar';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import { type IconColor } from '@atlaskit/tokens/css-type-schema';

import type { TextColorPlugin } from '../textColorPluginType';

const styles = cssMap({
	menu: {
		paddingBlock: token('space.025'),
		paddingInline: token('space.100'),
	},
});

interface TextColorHighlightMenuProps {
	api: ExtractInjectionAPI<TextColorPlugin> | undefined;
	children: React.ReactNode;
}

export const TextColorHighlightMenu = ({ children, api }: TextColorHighlightMenuProps) => {
	const isTextColorDisabled = useSharedPluginStateSelector(api, 'textColor.disabled');
	const highlightColor = useSharedPluginStateSelector(api, 'highlight.activeColor');
	const textColor = useSharedPluginStateSelector(api, 'textColor.color');
	const { formatMessage } = useIntl();

	return (
		<ToolbarDropdownMenu
			iconBefore={
				<ToolbarColorSwatch highlightColor={highlightColor || ''}>
					<TextColorIcon
						label={formatMessage(messages.textColorTooltip)}
						iconColor={(textColor || token('color.text.accent.magenta')) as IconColor}
						shouldRecommendSmallIcon={true}
						size={'small'}
						isDisabled={isTextColorDisabled}
						spacing={'compact'}
					/>
				</ToolbarColorSwatch>
			}
			isDisabled={isTextColorDisabled}
			testId="text-color-highlight-menu"
			hasSectionMargin={false}
		>
			<Box xcss={styles.menu}>{children}</Box>
		</ToolbarDropdownMenu>
	);
};
