import React from 'react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar/toolbar-dropdown-item-section';

import type { InternalNumberedHeadingsPlugin } from '../numberedHeadingsPluginType';
import { useIsNumberedHeadingsToggleAvailable } from './useIsNumberedHeadingsToggleAvailable';

type NumberedHeadingsMenuSectionProps = {
	api?: ExtractInjectionAPI<InternalNumberedHeadingsPlugin>;
	children: React.ReactNode;
};

export const NumberedHeadingsMenuSection = ({
	api,
	children,
}: NumberedHeadingsMenuSectionProps): React.JSX.Element | null => {
	const isAvailable = useIsNumberedHeadingsToggleAvailable(api);
	if (!isAvailable) {
		return null;
	}
	return <ToolbarDropdownItemSection hasSeparator>{children}</ToolbarDropdownItemSection>;
};
