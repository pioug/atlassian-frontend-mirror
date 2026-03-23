import React, { useCallback } from 'react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { BlockMenuPlugin } from '../blockMenuPluginType';

import { checkIsFormatMenuHidden } from './utils/checkIsFormatMenuHidden';

export const CopySection = ({
	api,
	children,
}: {
	api?: ExtractInjectionAPI<BlockMenuPlugin> | undefined;
	children: React.ReactNode;
}): React.JSX.Element => {
	const isFormatMenuHidden = useCallback(() => {
		return checkIsFormatMenuHidden(api);
	}, [api]);

	const hasSeparator = fg('platform_editor_block_menu_divider_patch')
		? true
		: editorExperiment('platform_synced_block', true)
			? true
			: !isFormatMenuHidden();

	return (
		<ToolbarDropdownItemSection hasSeparator={hasSeparator}>{children}</ToolbarDropdownItemSection>
	);
};
