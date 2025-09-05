import { useEffect } from 'react';

import type { ExtractInjectionAPI, NextEditorPlugin } from '../types';

/**
 *
 * A wrapper for popups to signal popupOpen user intent
 */
export const UserIntentPopupWrapper = ({
	children,
	api,
}: {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	api: ExtractInjectionAPI<NextEditorPlugin<any, any>> | undefined | null;
	children: React.ReactNode;
}) => {
	useEffect(() => {
		api?.core.actions.execute(api?.userIntent?.commands.setCurrentUserIntent('popupOpen'));

		return () => {
			api?.core.actions.execute(api?.userIntent?.commands.setCurrentUserIntent('default'));
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return children;
};
