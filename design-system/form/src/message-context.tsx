import { type Context, createContext } from 'react';

/**
 * __Message wrapper context__
 *
 * A message wrapper context allows the children to check
 * if it is contained within the MessageWrapper.
 */
export const MessageWrapperContext: Context<{ isWrapper: boolean }> = createContext<{
	isWrapper: boolean;
}>({
	isWrapper: false,
});
