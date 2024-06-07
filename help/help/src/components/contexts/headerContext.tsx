import React, { type PropsWithChildren } from 'react';
import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';

import { createCtx } from '../../util/hooks/ctx';

interface HeaderSharedInterface {
	onCloseButtonClick?(
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
	): void;
	onBackButtonClick?(
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
	): void;
}

export const [useHeaderContext, CtxProvider] = createCtx<HeaderSharedInterface>();

export const HeaderContextProvider = ({
	onCloseButtonClick,
	onBackButtonClick,
	children,
}: PropsWithChildren<HeaderSharedInterface>) => {
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
