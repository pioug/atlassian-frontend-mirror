import React from 'react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar';

import type { BlockMenuPlugin } from '../blockMenuPluginType';

export const AddBlocksSection = ({
	api,
	children,
}: {
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined;
	children: React.ReactNode;
}) => {
	const selection = api?.selection?.sharedState?.currentState()?.selection;

	if (!selection?.empty) {
		return null;
	}

	return <ToolbarDropdownItemSection hasSeparator={true}>{children}</ToolbarDropdownItemSection>;
};
