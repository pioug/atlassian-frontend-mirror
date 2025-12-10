import React, { useCallback } from 'react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { BlockMenuPlugin } from '../blockMenuPluginType';

import { checkIsFormatMenuHidden } from './utils/checkIsFormatMenuHidden';

export const CopySection = ({
	api,
	children,
}: {
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined;
	children: React.ReactNode;
}): React.JSX.Element => {
	const isFormatMenuHidden = useCallback(() => {
		return checkIsFormatMenuHidden(api);
	}, [api]);

	return (
		<ToolbarDropdownItemSection
			hasSeparator={editorExperiment('platform_synced_block', true) ? true : !isFormatMenuHidden()}
		>
			{children}
		</ToolbarDropdownItemSection>
	);
};
