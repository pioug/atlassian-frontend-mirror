import React, { type ReactNode, useContext, useEffect, useLayoutEffect, useState } from 'react';

import UFOInteractionContext from '../interaction-context';
import UFOInteractionIDContext, {
	subscribeToInteractionIdChanges,
} from '../interaction-id-context';

const useLayoutEffectSAFE = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Custom hook to track changes to the interaction ID.
 * Uses a subscription system to automatically update when the interaction ID changes.
 */
function useInteractionIdValue() {
	const interactionId = useContext(UFOInteractionIDContext);
	const [currentId, setCurrentId] = useState(interactionId?.current || null);

	useLayoutEffectSAFE(() => {
		setCurrentId(interactionId?.current || null);

		const unsubscribe = subscribeToInteractionIdChanges((newId) => {
			setCurrentId(newId);
		});

		return unsubscribe;
	}, [interactionId]);

	return currentId;
}

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
 *       <UFOLoadHold name="card" />
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
	experimental?: boolean;
};

export default function UFOLoadHold({ children, name, hold = true, experimental = false }: Props) {
	const currentInteractionId = useInteractionIdValue();

	// react-18: useId instead
	const context = useContext(UFOInteractionContext);

	useLayoutEffectSAFE(() => {
		if (hold && context != null) {
			if (experimental && context.holdExperimental) {
				return context.holdExperimental(name);
			}
			return context.hold(name);
		}
	}, [hold, context, name, currentInteractionId]);

	// react-18: can return children directly
	return children != null ? <>{children}</> : null;
}
