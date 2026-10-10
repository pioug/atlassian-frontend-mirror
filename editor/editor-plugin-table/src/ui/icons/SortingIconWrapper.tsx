import React from 'react';

import SortingIcon from '@atlaskit/editor-common/table/SortingIcon';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/useSharedPluginStateWithSelector';

import type { TablePlugin } from '../../tablePluginType';

type SortingIconProps = React.ComponentProps<typeof SortingIcon>;
type SortingIconWrapperProps = SortingIconProps & {
	api: ExtractInjectionAPI<TablePlugin>;
};

export const SortingIconWrapper = (props: SortingIconWrapperProps): React.JSX.Element | null => {
	const { mode } = useSharedPluginStateWithSelector(props.api, ['editorViewMode'], (states) => ({
		mode: states.editorViewModeState?.mode,
	}));
	if (mode === 'edit') {
		return null;
	}
	// Ignored via go/ees005
	// eslint-disable-next-line react/jsx-props-no-spreading
	return <SortingIcon {...props} />;
};
