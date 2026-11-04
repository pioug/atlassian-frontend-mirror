import React from 'react';

// eslint-disable-next-line @atlaskit/platform/no-barrel-entry-imports
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
// eslint-disable-next-line @atlaskit/platform/no-barrel-entry-imports
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar/toolbar-dropdown-item-section';

import type { InternalNumberedHeadingsPlugin } from '../numberedHeadingsPluginType';
import { useIsNumberedHeadingsToggleAvailable } from './useIsNumberedHeadingsToggleAvailable';
import { useUndoRedoWhileMenuOpen } from './useUndoRedoWhileMenuOpen';

type NumberedHeadingsMenuSectionProps = {
	api?: ExtractInjectionAPI<InternalNumberedHeadingsPlugin>;
	children: React.ReactNode;
};

export const NumberedHeadingsMenuSection = ({
	api,
	children,
}: NumberedHeadingsMenuSectionProps): React.JSX.Element | null => {
	const isAvailable = useIsNumberedHeadingsToggleAvailable(api);
	const { editorView } = useEditorToolbar();
	useUndoRedoWhileMenuOpen(isAvailable ? editorView : null);
	if (!isAvailable) {
		return null;
	}
	return <ToolbarDropdownItemSection hasSeparator>{children}</ToolbarDropdownItemSection>;
};
