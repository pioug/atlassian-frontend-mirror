import { type Context, createContext } from 'react';

export type MessageTransition = 'row' | 'instant' | 'groupEnter' | 'groupExit';

/**
 * __Message wrapper context__
 *
 * A message wrapper context allows the children to check
 * if it is contained within the MessageWrapper.
 */
export const MessageWrapperContext: Context<{
	isWrapper: boolean;
	hasMotionBoundary: boolean;
	transition: MessageTransition;
}> = createContext<{
	isWrapper: boolean;
	hasMotionBoundary: boolean;
	transition: MessageTransition;
}>({
	isWrapper: false,
	hasMotionBoundary: false,
	transition: 'row',
});
