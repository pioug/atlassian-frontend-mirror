import React, { useCallback, useEffect } from 'react';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { BlockTypePlugin } from '../../blockTypePluginType';
import type { TextBlockTypes } from '../block-types';

import ToolbarBlockType from './ToolbarBlockType';

interface FloatingToolbarComponentProps {
	api: ExtractInjectionAPI<BlockTypePlugin> | undefined;
}

const FloatingToolbarSettings = {
	isSmall: true,
	disabled: false,
	isToolbarReducedSpacing: true,
	shouldUseDefaultRole: false,
};

export function FloatingToolbarComponent({ api }: FloatingToolbarComponentProps) {
	const { blockTypeState } = useSharedPluginState(api, ['blockType']);

	useEffect(() => {
		editorExperiment('contextual_formatting_toolbar', true, { exposure: true });
	}, []);

	const boundSetBlockType = useCallback(
		(name: TextBlockTypes) =>
			api?.core?.actions.execute(
				api?.blockType?.commands?.setTextLevel(name, INPUT_METHOD.FLOATING_TB),
			),
		[api],
	);

	return (
		<ToolbarBlockType
			isSmall={FloatingToolbarSettings.isSmall}
			isDisabled={FloatingToolbarSettings.disabled}
			isReducedSpacing={FloatingToolbarSettings.isToolbarReducedSpacing}
			setTextLevel={boundSetBlockType}
			pluginState={blockTypeState!}
			shouldUseDefaultRole={FloatingToolbarSettings.shouldUseDefaultRole}
			api={api}
		/>
	);
}
