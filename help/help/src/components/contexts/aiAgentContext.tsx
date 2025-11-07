import React, { type PropsWithChildren } from 'react';
import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { createCtx } from '../../util/hooks/ctx';

export interface AiContextInterface {
	// Boolean flag to enable the AI feature. This prop is optional
	isAiEnabled?: boolean;
	// Event handler fired when the user clicks the "Ask AI" tab. This prop is optional
	onAiTabClicked?(
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
	): void;
	// Event handler fired when the user clicks the "Search" tab. This prop is optional
	onSearchTabClicked?(
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
	): void;
}

const dest = createCtx<AiContextInterface>();
export const useAiContext: () => AiContextInterface = dest[0];
export const CtxProvider: React.Provider<AiContextInterface | undefined> = dest[1];

export const AiContextProvider = ({
	isAiEnabled,
	onSearchTabClicked,
	onAiTabClicked,
	children,
}: PropsWithChildren<AiContextInterface>): React.JSX.Element => {
	return (
		<CtxProvider
			value={{
				isAiEnabled,
				onSearchTabClicked,
				onAiTabClicked,
			}}
		>
			{children}
		</CtxProvider>
	);
};
