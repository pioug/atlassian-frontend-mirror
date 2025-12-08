import React, { useCallback } from 'react';

import type { OnOpenChangeArgs } from '@atlaskit/dropdown-menu';
import type { ToolbarUIContextType } from '@atlaskit/editor-toolbar';
import { ToolbarUIProvider } from '@atlaskit/editor-toolbar';
import { fg } from '@atlaskit/platform-feature-flags';

import type { ExtractInjectionAPI, NextEditorPlugin } from '../types';

type Props = Pick<
	ToolbarUIContextType,
	| 'popupsMountPoint'
	| 'popupsBoundariesElement'
	| 'popupsScrollableElement'
	| 'fireAnalyticsEvent'
	| 'keyboardNavigation'
> & {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	api: ExtractInjectionAPI<NextEditorPlugin<any, any>> | undefined;
	children: React.ReactNode;
	isDisabled?: boolean;
};
export const EditorToolbarUIProvider = ({
	children,
	api,
	isDisabled,
	popupsMountPoint,
	popupsBoundariesElement,
	popupsScrollableElement,
	fireAnalyticsEvent,
	keyboardNavigation,
}: Props): React.JSX.Element => {
	const onDropdownOpenChanged = useCallback(
		({ isOpen, event }: OnOpenChangeArgs) => {
			if (!isOpen) {
				if (fg('platform_editor_toolbar_aifc_patch_7')) {
					// Only refocus the editor when the dropdown closes via mouse or programmatic close.
					// When closed via keyboard Escape, keep focus on the trigger for better keyboard UX.
					const isKeyboardEscape = event instanceof KeyboardEvent && event.key === 'Escape';
					const shouldFocusEditor = !isKeyboardEscape;

					if (shouldFocusEditor) {
						// On Dropdown closed, focus is returned to trigger button by default in requestAnimationFrame
						// Hence, `.focus()` should also be called in requestAnimationFrame
						setTimeout(
							() =>
								requestAnimationFrame(() => {
									api?.core.actions.focus({ scrollIntoView: false });
								}),
							1,
						);
					}
				} else {
					// On Dropdown closed, focus is returned to trigger button by default in requestAnimationFrame
					// Hence, `.focus()` should also be called in requestAnimationFrame
					setTimeout(
						() =>
							requestAnimationFrame(() => {
								api?.core.actions.focus({ scrollIntoView: false });
							}),
						1,
					);
				}
			}
		},
		[api],
	);

	return (
		<ToolbarUIProvider
			onDropdownOpenChanged={onDropdownOpenChanged}
			preventDefaultOnMouseDown
			isDisabled={isDisabled}
			popupsMountPoint={popupsMountPoint}
			popupsBoundariesElement={popupsBoundariesElement}
			popupsScrollableElement={popupsScrollableElement}
			fireAnalyticsEvent={fireAnalyticsEvent}
			keyboardNavigation={keyboardNavigation}
		>
			{children}
		</ToolbarUIProvider>
	);
};
