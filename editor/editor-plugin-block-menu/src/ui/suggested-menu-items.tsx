import React from 'react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { BlockMenuPlugin } from '../blockMenuPluginType';

import { useSuggestedItems } from './hooks/useSuggestedItems';

type SuggestedMenuItemsProps = {
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined;
};

export const SuggestedMenuItems = React.memo<SuggestedMenuItemsProps>(({ api }) => {
	const suggestedItems = useSuggestedItems(api);

	return (
		<>
			{suggestedItems.map((item) => {
				const ItemComponent = item.component;
				return ItemComponent ? <ItemComponent key={item.key} /> : null;
			})}
		</>
	);
});
