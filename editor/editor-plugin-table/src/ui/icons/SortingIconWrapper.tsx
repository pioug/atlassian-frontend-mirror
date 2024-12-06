import React from 'react';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { SortingIcon } from '@atlaskit/editor-common/table';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { TablePlugin } from '../../tablePluginType';

type SortingIconProps = React.ComponentProps<typeof SortingIcon>;
type SortingIconWrapperProps = SortingIconProps & {
	api: ExtractInjectionAPI<TablePlugin>;
};

export const SortingIconWrapper = (props: SortingIconWrapperProps) => {
	const { editorViewModeState } = useSharedPluginState(props.api, ['editorViewMode']);
	if (editorViewModeState?.mode === 'edit') {
		return null;
	}
	return <SortingIcon {...props} />;
};
