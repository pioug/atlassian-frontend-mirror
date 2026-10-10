import React from 'react';

import { useIntl } from 'react-intl';

import { alignmentMessages as messages } from '@atlaskit/editor-common/alignment';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/useSharedPluginStateWithSelector';
import { ToolbarDropdownMenu } from '@atlaskit/editor-toolbar/toolbar-dropdown-menu';
import { ToolbarTooltip } from '@atlaskit/editor-toolbar/toolbar-tooltip';

import type { AlignmentPlugin } from '../../alignmentPluginType';
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
		(states) => ({
			align: states.alignmentState?.align,
			isEnabled: states.alignmentState?.isEnabled,
		}),
	);
	const { icon: Icon } = alignmentOptions()[align];
	const { formatMessage } = useIntl();
	const title = formatMessage(messages.alignment);

	return (
		<ToolbarDropdownMenu
			iconBefore={<Icon label="" size="small" testId={`text-alignment-menu-${align}-icon`} />}
			isDisabled={!isEnabled}
			testId="text-alignment-menu"
			label={title}
			tooltipComponent={<ToolbarTooltip content={title} />}
		>
			{children}
		</ToolbarDropdownMenu>
	);
};
