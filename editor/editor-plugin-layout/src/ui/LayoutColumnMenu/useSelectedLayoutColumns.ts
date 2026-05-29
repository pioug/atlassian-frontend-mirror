import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { LayoutPlugin } from '../../layoutPluginType';
import {
	getSelectedLayoutColumnsFromSelection,
	type SelectedLayoutColumns,
} from '../../pm-plugins/utils/layout-column-selection';

export const useSelectedLayoutColumns = (
	api: ExtractInjectionAPI<LayoutPlugin> | undefined,
): SelectedLayoutColumns | undefined =>
	useSharedPluginStateWithSelector(api, ['selection'], ({ selectionState }) => {
		const selectedLayoutColumns =
			selectionState?.selection && getSelectedLayoutColumnsFromSelection(selectionState.selection);

		return selectedLayoutColumns?.selectedLayoutColumns.length ? selectedLayoutColumns : undefined;
	});
