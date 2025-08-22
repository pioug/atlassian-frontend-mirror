import React from 'react';

import { useIntl } from 'react-intl-next';

import { selectionToolbarMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { PinnedIcon, ToolbarButton, ToolbarTooltip } from '@atlaskit/editor-toolbar';

import type { SelectionToolbarPlugin } from '../selectionToolbarPluginType';

export const PinButton = ({ api }: { api?: ExtractInjectionAPI<SelectionToolbarPlugin> }) => {
	const intl = useIntl();
	const message = intl.formatMessage(selectionToolbarMessages.toolbarPositionPinedAtTop);

	const onClick = () => {
		if (!api) {
			return;
		}
		api.selectionToolbar.actions?.setToolbarDocking?.('none');
	};

	return (
		<ToolbarTooltip content={message}>
			<ToolbarButton
				iconBefore={<PinnedIcon size="small" label="" />}
				label={message}
				onClick={onClick}
			/>
		</ToolbarTooltip>
	);
};
