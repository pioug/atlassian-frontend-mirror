import React from 'react';

import { useIntl } from 'react-intl';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { alignmentMessages as messages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownMenu, ToolbarTooltip } from '@atlaskit/editor-toolbar';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

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
		['alignment', 'interaction'],
		(states) => ({
			align:
				states.interactionState?.interactionState === 'hasNotHadInteraction' &&
				isExperimentEnabled('platform_editor_default_toolbar_state')
					? 'start'
					: states.alignmentState?.align,
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
