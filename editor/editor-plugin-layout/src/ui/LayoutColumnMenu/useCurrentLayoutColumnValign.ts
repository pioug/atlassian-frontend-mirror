import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Valign } from '@atlaskit/editor-common/types/valign';
import type { Node as ProsemirrorNode } from '@atlaskit/editor-prosemirror/model';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';

import type { LayoutPlugin } from '../../layoutPluginType';

export type CurrentLayoutColumnValignState = {
	currentValign: Valign | undefined;
	selectedColumn: ProsemirrorNode | undefined;
};

export const getCurrentLayoutColumnValign = (
	selection: Selection | undefined,
): CurrentLayoutColumnValignState => {
	const selectedColumn =
		selection instanceof NodeSelection && selection.node.type.name === 'layoutColumn'
			? selection.node
			: undefined;
	const currentValign = selectedColumn?.attrs.valign as Valign | undefined;

	return { currentValign, selectedColumn };
};

export const useCurrentLayoutColumnValign = (
	api: ExtractInjectionAPI<LayoutPlugin> | undefined,
): CurrentLayoutColumnValignState =>
	useSharedPluginStateWithSelector(api, ['selection'], (states) =>
		getCurrentLayoutColumnValign(states.selectionState?.selection),
	);
