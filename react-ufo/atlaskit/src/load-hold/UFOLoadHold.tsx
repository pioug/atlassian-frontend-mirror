import React, { type ReactNode, useContext, useEffect, useLayoutEffect } from 'react';

import UFOInteractionContext from '../interaction-context';

const useLayoutEffectSAFE = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Render this whenever you're loading.
 *
 * Wrap loading elements
 * ```js
 * if (isLoading){
 *   return (
 *     <UFOLoadHold name="card">
 *       <Skeleton />
 *     </UFOLoadHold>
 *   )
 * }
 * ```
 *
 * Or render it as a sibling
 * ```
 * if (isLoading){
 *   return (
 *     <>
 *       <Skeleton />
 *       <UFOLoadHold name="card">
 *     </UFOLoadHold>
 *   )
 * }
 * ```
 *
 * Or wrap your content conditionally
 * ```
 * return (
 *   <UFOLoadHold name="card" hold={isLoading}>
 *     <Card />
 *   </UFOLoadHold>
 * )
 * ```
 *
 * Or render as a sibling conditionally
 * ```
 * return (
 *   <>
 *     <Card />
 *     <UFOLoadHold name="card" hold={isLoading} />
 *   </>
 * )
 * ```
 */
type Props = {
	name: string;
	hold?: boolean;
	children?: ReactNode;
};

export default function UFOLoadHold({ children, name, hold = true }: Props) {
	// react-18: useId instead
	const context = useContext(UFOInteractionContext);

	useLayoutEffectSAFE(() => {
		if (hold && context != null) {
			return context.hold(name);
		}
	}, [hold, context, name]);

	// react-18: can return children directly
	return children != null ? <>{children}</> : null;
}
