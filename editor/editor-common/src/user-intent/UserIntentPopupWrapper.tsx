import { useEffect } from 'react';

import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

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
		api?.core.actions.execute(
			api?.userIntent?.commands.setCurrentUserIntent(
				expValEqualsNoExposure('platform_editor_lovability_user_intent', 'isEnabled', true)
					? userIntent
					: 'popupOpen',
			),
		);

		return () => {
			if (
				userIntent === api?.userIntent?.sharedState.currentState().currentUserIntent &&
				expValEqualsNoExposure('platform_editor_lovability_user_intent', 'isEnabled', true)
			) {
				api?.core.actions.execute(api?.userIntent?.commands.setCurrentUserIntent('default'));
			}

			if (!expValEqualsNoExposure('platform_editor_lovability_user_intent', 'isEnabled', true)) {
				api?.core.actions.execute(api?.userIntent?.commands.setCurrentUserIntent('default'));
			}
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return children;
};
