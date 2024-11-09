import { useEffect, useRef } from 'react';

/**
 * Returns the latest value in a ref object.
 * Helpful for avoiding re-rendering
 *
 * @example
 *
 * ```tsx
 * import { useEffect, useRef } from 'react';
 *
 * import { bind } from 'bind-event-listener';
 *
 * function App({ onClick }: { onClick: () => void }) {
 * 	const stableRef = useStableRef({ onClick });
 * 	const ref = useRef();
 *
 * 	useEffect(
 * 		() => {
 * 			if (!ref.current) {
 * 				return;
 * 			}
 * 			return bind(ref.current, { type: 'click', listener: () => stableRef.onClick() });
 * 		},
 * 		// 👋 onClick no longer a dependency for this effect
 * 		[stableRef],
 * 	);
 *
 * 	return (
 * 		<button ref={ref} type="button">
 * 			Hi there
 * 		</button>
 * 	);
 * }
 * ```
 */
export default function useStableRef<T>(value: T): React.MutableRefObject<T> {
	const ref = useRef<T>(value);

	useEffect(() => {
		ref.current = value;
	}, [value]);

	return ref;
}
