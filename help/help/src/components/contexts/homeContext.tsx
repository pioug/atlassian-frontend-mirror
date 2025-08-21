import React, { type PropsWithChildren } from 'react';
import { createCtx } from '../../util/hooks/ctx';
import type { Props as HelpContentButtonProps } from '../HelpContentButton';

export interface HomeContextInterface {
	homeContent?: React.ReactNode;
	homeOptions?: HelpContentButtonProps[];
}

export const [useHomeContext, CtxProvider] = createCtx<HomeContextInterface>();

export const HomeContextProvider = ({
	homeOptions,
	homeContent,
	children,
}: PropsWithChildren<HomeContextInterface>) => {
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
