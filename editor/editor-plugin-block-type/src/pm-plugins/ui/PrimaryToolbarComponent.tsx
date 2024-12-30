import React from 'react';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { BlockTypePlugin } from '../../blockTypePluginType';
import type { TextBlockTypes } from '../block-types';

import ToolbarBlockType from './ToolbarBlockType';

interface PrimaryToolbarComponentProps {
	isSmall: boolean;
	isToolbarReducedSpacing: boolean;
	disabled: boolean;
	api: ExtractInjectionAPI<BlockTypePlugin> | undefined;
	popupsMountPoint?: HTMLElement;
	popupsBoundariesElement?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	shouldUseDefaultRole: boolean;
}

export function PrimaryToolbarComponent({
	api,
	isSmall,
	disabled,
	isToolbarReducedSpacing,
	popupsMountPoint,
	popupsBoundariesElement,
	popupsScrollableElement,
	shouldUseDefaultRole,
}: PrimaryToolbarComponentProps) {
	const { blockTypeState } = useSharedPluginState(api, ['blockType']);
	const boundSetBlockType = (name: TextBlockTypes, fromBlockQuote?: boolean) =>
		api?.core?.actions.execute(
			api?.blockType?.commands?.setTextLevel(name, INPUT_METHOD.TOOLBAR, fromBlockQuote),
		);
	const wrapBlockQuote = () =>
		api?.core?.actions.execute(api?.blockType?.commands?.insertBlockQuote(INPUT_METHOD.TOOLBAR));
	const clearFormatting = () =>
		api?.core?.actions.execute(api?.blockType?.commands?.clearFormatting());
	return (
		<ToolbarBlockType
			isSmall={isSmall}
			isDisabled={disabled}
			isReducedSpacing={isToolbarReducedSpacing}
			setTextLevel={boundSetBlockType}
			wrapBlockQuote={wrapBlockQuote}
			clearFormatting={clearFormatting}
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			pluginState={blockTypeState!}
			popupsMountPoint={popupsMountPoint}
			popupsBoundariesElement={popupsBoundariesElement}
			popupsScrollableElement={popupsScrollableElement}
			shouldUseDefaultRole={shouldUseDefaultRole}
			api={api}
		/>
	);
}
