import React from 'react';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { SortingIcon } from '@atlaskit/editor-common/table';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { TablePlugin } from '../../tablePluginType';

type SortingIconProps = React.ComponentProps<typeof SortingIcon>;
type SortingIconWrapperProps = SortingIconProps & {
	api: ExtractInjectionAPI<TablePlugin>;
};

export const SortingIconWrapper = (props: SortingIconWrapperProps) => {
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
