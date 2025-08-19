import React, { useCallback } from 'react';

import type { OnOpenChangeArgs } from '@atlaskit/dropdown-menu';
import { ToolbarUIProvider } from '@atlaskit/editor-toolbar';

import type { ExtractInjectionAPI, NextEditorPlugin } from '../types';

export const EditorToolbarUIProvider = ({
	children,
	api,
	isDisabled,
}: {
	children: React.ReactNode;
	isDisabled?: boolean;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	api: ExtractInjectionAPI<NextEditorPlugin<any, any>> | undefined;
}) => {
	const onDropdownOpenChanged = useCallback(
		({ isOpen }: OnOpenChangeArgs) => {
			if (!isOpen) {
				// On Dropdown closed, focus is returned to trigger button by default in requestAnimationFrame
				// Hence, `.focus()` should also be called in requestAnimationFrame
				requestAnimationFrame(() => {
					api?.core.actions.focus();
				});
			}
		},
		[api],
	);

	return (
		<ToolbarUIProvider
			onDropdownOpenChanged={onDropdownOpenChanged}
			preventDefaultOnMouseDown
			isDisabled={isDisabled}
		>
			{children}
		</ToolbarUIProvider>
	);
};
