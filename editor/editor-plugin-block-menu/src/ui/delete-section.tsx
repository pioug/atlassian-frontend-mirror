import React from 'react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import type { BlockMenuPlugin } from '../blockMenuPluginType';

export const DeleteSection = ({
	api,
	children,
}: {
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined;
	children: React.ReactNode;
}) => {
	const selection = api?.selection?.sharedState?.currentState()?.selection;
	const isEmptyLineSelected =
		!!selection?.empty &&
		expValEqualsNoExposure('platform_editor_block_menu_empty_line', 'isEnabled', true);

	if (isEmptyLineSelected) {
		return null;
	}

	return <ToolbarDropdownItemSection hasSeparator>{children}</ToolbarDropdownItemSection>;
};
