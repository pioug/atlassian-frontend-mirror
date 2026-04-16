import { createContext, type Context } from 'react';

export const SideNavRefContext: Context<React.RefObject<HTMLDivElement>> = createContext<
	React.RefObject<HTMLDivElement>
>({ current: null });
