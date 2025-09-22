import React, { useCallback } from 'react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar';
import { fg } from '@atlaskit/platform-feature-flags';

import type { BlockMenuPlugin } from '../blockMenuPluginType';

import { checkIsFormatMenuHidden } from './utils/checkIsFormatMenuHidden';

export const FormatMenuSection = ({
	children,
	api,
}: {
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined;
	children: React.ReactNode;
}) => {
	const isFormatMenuHidden = useCallback(() => {
		return checkIsFormatMenuHidden(api);
	}, [api]);

	// When platform_editor_block_menu_for_disabled_nodes feature flag is OFF, use the original behavior (hide the menu)
	if (isFormatMenuHidden() && !fg('platform_editor_block_menu_for_disabled_nodes')) {
		return null;
	}

	return <ToolbarDropdownItemSection>{children}</ToolbarDropdownItemSection>;
};
