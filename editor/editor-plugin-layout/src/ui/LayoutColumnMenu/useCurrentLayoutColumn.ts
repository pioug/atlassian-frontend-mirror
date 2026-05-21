import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { LayoutPlugin } from '../../layoutPluginType';

import { getLayoutColumnAtSelection, getLayoutSectionAtSelection } from './layoutColumnSelection';

export const useCurrentLayoutColumn = (
	api: ExtractInjectionAPI<LayoutPlugin> | undefined,
): PMNode | undefined =>
	useSharedPluginStateWithSelector(api, ['selection'], (states) =>
		getLayoutColumnAtSelection(states.selectionState?.selection),
	);

export const useCurrentLayoutSection = (
	api: ExtractInjectionAPI<LayoutPlugin> | undefined,
): PMNode | undefined =>
	useSharedPluginStateWithSelector(api, ['selection'], (states) =>
		getLayoutSectionAtSelection(states.selectionState?.selection),
	);
