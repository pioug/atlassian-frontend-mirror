import React from 'react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar';

import type { BlockMenuPlugin } from '../blockMenuPluginType';

import { useSuggestedItems } from './hooks/useSuggestedItems';

type SuggestedItemsMenuSectionProps = {
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined;
	children?: React.ReactNode;
};

export const SuggestedItemsMenuSection = React.memo<SuggestedItemsMenuSectionProps>(
	({ api, children }) => {
		const suggestedItems = useSuggestedItems(api);

		if (suggestedItems.length === 0) {
			return null;
		}

		return (
			<ToolbarDropdownItemSection title="Suggested">{children}</ToolbarDropdownItemSection>
		);
	},
);
