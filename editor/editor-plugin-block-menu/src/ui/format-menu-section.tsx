import React, { useCallback } from 'react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import type { BlockMenuPlugin } from '../blockMenuPluginType';

import { checkIsFormatMenuHidden } from './utils/checkIsFormatMenuHidden';

export const FormatMenuSection = ({
	children,
	api,
}: {
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined;
	children: React.ReactNode;
}): React.JSX.Element | null => {
	const isFormatMenuHidden = useCallback(() => {
		return checkIsFormatMenuHidden(api);
	}, [api]);

	if (isFormatMenuHidden()) {
		return null;
	}

	return (
		<ToolbarDropdownItemSection
			hasSeparator={expValEqualsNoExposure(
				'platform_editor_ai_blockmenu_integration',
				'isEnabled',
				true,
			)}
		>
			{children}
		</ToolbarDropdownItemSection>
	);
};
