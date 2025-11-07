import React, { type PropsWithChildren } from 'react';
import { createCtx } from '../../util/hooks/ctx';
import type { Props as HelpContentButtonProps } from '../HelpContentButton';

export interface HomeContextInterface {
	homeContent?: React.ReactNode;
	homeOptions?: HelpContentButtonProps[];
}

const dest = createCtx<HomeContextInterface>();
export const useHomeContext: () => HomeContextInterface = dest[0];
export const CtxProvider: React.Provider<HomeContextInterface | undefined> = dest[1];

export const HomeContextProvider = ({
	homeOptions,
	homeContent,
	children,
}: PropsWithChildren<HomeContextInterface>): React.JSX.Element => {
	return (
		<CtxProvider
			value={{
				homeOptions,
				homeContent,
			}}
		>
			{children}
		</CtxProvider>
	);
};
