import React from 'react';

import {
	sharedPluginStateHookMigratorFactory,
	useSharedPluginState,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/hooks';
import { SortingIcon } from '@atlaskit/editor-common/table';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { TablePlugin } from '../../tablePluginType';

type SortingIconProps = React.ComponentProps<typeof SortingIcon>;
type SortingIconWrapperProps = SortingIconProps & {
	api: ExtractInjectionAPI<TablePlugin>;
};

const useSharedState = sharedPluginStateHookMigratorFactory(
	(api: ExtractInjectionAPI<TablePlugin> | undefined) => {
		const { mode } = useSharedPluginStateWithSelector(api, ['editorViewMode'], (states) => ({
			mode: states.editorViewModeState?.mode,
		}));
		return {
			mode,
		};
	},
	(api: ExtractInjectionAPI<TablePlugin> | undefined) => {
		const { editorViewModeState } = useSharedPluginState(api, ['editorViewMode']);
		return {
			mode: editorViewModeState?.mode,
		};
	},
);

export const SortingIconWrapper = (props: SortingIconWrapperProps) => {
	const { mode } = useSharedState(props.api);
	if (mode === 'edit') {
		return null;
	}
	// Ignored via go/ees005
	// eslint-disable-next-line react/jsx-props-no-spreading
	return <SortingIcon {...props} />;
};
