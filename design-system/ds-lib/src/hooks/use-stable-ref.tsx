import { useEffect, useRef } from 'react';

/**
 * Returns the latest value in a ref object.
 * Helpful for avoiding re-rendering.
 *
 * **Note:** there might be memory issues if the provided argument is an object containing refs, DOM elements, or event listeners.
 * It's recommended to use this hook with a single value to assist with automatic memory clean up.
 *
 * @example
 *
 * ```tsx
 * import { useEffect, useRef } from 'react';
 *
 * import { bind } from 'bind-event-listener';
 *
 * function App({ onClick }: { onClick: () => void }) {
 * 	const onClickStableRef = useStableRef(onClick);
 * 	const ref = useRef();
 *
 * 	useEffect(
 * 		() => {
 * 			if (!ref.current) {
 * 				return;
 * 			}
 * 			return bind(ref.current, { type: 'click', listener: () => onClickStableRef.current() });
 * 		},
 * 		// 👋 onClick no longer a dependency for this effect
 * 		[onClickStableRef],
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
