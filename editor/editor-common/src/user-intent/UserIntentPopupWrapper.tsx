import { useEffect } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import type { ExtractInjectionAPI, NextEditorPlugin } from '../types';

import type { PopupUserIntent } from './types';

/**
 *
 * A wrapper for popups to signal popupOpen user intent
 */
export const UserIntentPopupWrapper = ({
	userIntent = 'popupOpen',
	children,
	api,
}: {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	api: ExtractInjectionAPI<NextEditorPlugin<any, any>> | undefined | null;
	children: React.ReactNode;
	userIntent?: PopupUserIntent;
}) => {
	useEffect(() => {
		api?.core.actions.execute(api?.userIntent?.commands.setCurrentUserIntent(userIntent));

		return () => {
			if (userIntent === api?.userIntent?.sharedState.currentState()?.currentUserIntent) {
				if (fg('platform_editor_fix_popup_user_intent')) {
					// Defer the reset to avoid interfering with ongoing ProseMirror transactions
					// This fixes a race condition where cleanup happens during a transaction
					// (e.g., during drag handle mouse over -> unmountDecorations -> flushSync)
					setTimeout(() => {
						api?.core.actions.execute(api?.userIntent?.commands.setCurrentUserIntent('default'));
					}, 0);
				} else {
					api?.core.actions.execute(api?.userIntent?.commands.setCurrentUserIntent('default'));
				}
			}
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return children;
};
