import React, { useCallback } from 'react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar';

import type { BlockMenuPlugin } from '../blockMenuPluginType';

import { checkIsFormatMenuHidden } from './utils/checkIsFormatMenuHidden';

export const FormatMenuSection = ({
	children,
	api,
}: {
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined;
	children: React.ReactNode;
}) => {
	const isFormatMenuHidden = useCallback(() => {
		return checkIsFormatMenuHidden(api);
	}, [api]);

	if (isFormatMenuHidden()) {
		return null;
	}

	return <ToolbarDropdownItemSection>{children}</ToolbarDropdownItemSection>;
};
