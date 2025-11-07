import React, { type PropsWithChildren } from 'react';
import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';

import { createCtx } from '../../util/hooks/ctx';

interface HeaderSharedInterface {
	onBackButtonClick?(
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
	): void;
	onCloseButtonClick?(
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
	): void;
}

const dest = createCtx<HeaderSharedInterface>();
export const useHeaderContext: () => HeaderSharedInterface = dest[0];
export const CtxProvider: React.Provider<HeaderSharedInterface | undefined> = dest[1];

export const HeaderContextProvider = ({
	onCloseButtonClick,
	onBackButtonClick,
	children,
}: PropsWithChildren<HeaderSharedInterface>): React.JSX.Element => {
	return (
		<CtxProvider
			value={{
				onCloseButtonClick,
				onBackButtonClick,
			}}
		>
			{children}
		</CtxProvider>
	);
};
