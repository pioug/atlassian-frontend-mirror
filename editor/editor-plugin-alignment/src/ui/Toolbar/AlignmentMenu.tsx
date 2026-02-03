import React from 'react';

import { useIntl } from 'react-intl-next';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { alignmentMessages as messages } from '@atlaskit/editor-common/messages';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownMenu, ToolbarTooltip } from '@atlaskit/editor-toolbar';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { type AlignmentPlugin } from '../../alignmentPluginType';

import { alignmentOptions } from './options';

export const AlignmentMenu = ({
	children,
	api,
}: {
	api: ExtractInjectionAPI<AlignmentPlugin> | undefined;
	children?: React.ReactNode;
}): React.JSX.Element => {
	const { align = 'start', isEnabled } = useSharedPluginStateWithSelector(
		api,
		['alignment'],
		(states) => {
			return {
				align: states.alignmentState?.align,
				isEnabled: states.alignmentState?.isEnabled,
			};
		},
	);
	const { icon: Icon } = alignmentOptions()[align];
	const { formatMessage } = useIntl();
	const title = formatMessage(messages.alignment);

	if (expValEquals('platform_editor_hide_toolbar_tooltips_fix', 'isEnabled', true)) {
		return (
			<ToolbarDropdownMenu
				iconBefore={<Icon label="" size="small" />}
				isDisabled={!isEnabled}
				testId="text-alignment-menu"
				label={title}
				tooltipComponent={<ToolbarTooltip content={title}/>}
			>
				{children}
			</ToolbarDropdownMenu>
		);
	};

	return (
		<ToolbarTooltip content={title}>
			<ToolbarDropdownMenu
				iconBefore={<Icon label="" size="small" />}
				isDisabled={!isEnabled}
				testId="text-alignment-menu"
				label={title}
			>
				{children}
			</ToolbarDropdownMenu>
		</ToolbarTooltip>
	);
};
