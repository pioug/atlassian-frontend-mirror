# DSLib

This is an internal package with common functionality used in the Atlassian Design System Team. This
package comes with no support and semver guarantees, your app will break if you use this directly!

## Installation

```sh
yarn add @atlaskit/ds-lib
```

## Utilities

### `noop()`

```tsx
import noop from '@atlaskit/ds-lib/noop';

noop();
```

### `once()`

Create a new `function` that only allows an existing `function` to be called once.

```tsx
import once from '@atlaskit/ds-lib/once';

function getGreeting(name: string): string {
	return `Hello ${name}`;
}
const getGreetingOnce = once(getGreeting);

getGreetingOnce('Alex');
// getGreeting called and "Hello Alex" is returned
// "Hello Alex" is put into the cache.
// returns "Hello Alex"

getGreetingOnce('Sam');
// getGreeting is not called
// "Hello Alex" is returned from the cache.

getGreetingOnce('Greg');
// getGreeting is not called
// "Hello Alex" is returned from the cache.
```

Notes:

- If the `onced` function throws, then the return value of the function is not cached
- Respects call site context (`this`) when executing the onced function

### `warnOnce()`

```tsx
import warnOnce from '@atlaskit/ds-lib/warn-once';

function Component() {
	// Print the warning messagein in the Web console only once per session.
	if (process.env.NODE_ENV !== 'production') {
		warnOnce('This component has been deprecated.');
	}

	return <div>This component has been deprecated</div>;
}
```

### `mergeRefs()`

```tsx
import mergeRefs from '@atlaskit/ds-lib/merge-refs';

const Component = forwardRef((props, ref) => {
  const customRef = useRef<HTMLElement | null>(null);

  return (
    // Use the utility function to merge the forwarded ref
    // with the created ref.
    <div ref={mergeRefs[ref, customRef]} />
  );
}
```

### `device-check`

```tsx
import { isAppleDevice, isSafari } from '@atlaskit/ds-lib/device-check';
isAppleDevice();
isSafari();
```

## React hooks

### `useLazyRef()`

```tsx
import useLazyRef from '@atlaskit/ds-lib/use-lazy-ref';

function Component({ onClick }) {
	// Initialize the ref
	const ref = useLazyRef(() => {
		/* Return initial data */
	});

	// Access like a normal ref
	return <button onClick={() => onClick(ref.current)}>Click me!</button>;
}
```

### `useControlled()`

```tsx
import useControlled from '@atlaskit/ds-lib/use-controlled';

function ControlledComponent({ value, defaultValue = 0 }) {
	const [uncontrolledState, setUncontrolledState] = useControlled(value, () => defaultValue);
	return <button onClick={() => setUncontrolledState(uncontrolledState + 1)}>Update state</button>;
}
```

### `usePreviousValue()`

```js
function Component() {
	const [currentValue] = useState(1);
	const previousValue = usePreviousValue(currentValue);

	previousValue; // undefined
	currentValue; // 1

	return null;
}
```

### `useStableRef()`

```tsx
function Component({ canShow }: { canShow: () => boolean }) {
	const stableRef = useStableRef({ canShow });

	useEffect(
		() => {
			stableRef.current.canShow();
		},
		// Able to use the last render value of `canShow` without needing
		// to invalidate the effect. Useful for lazy usage of props.
		[],
	);

	return null;
}
```

### `useLazyCallback()`

```tsx
import useLazyCallback from '@atlaskit/ds-lib/use-lazy-callback';

function Component() {
	// `callback` always has the same reference.
	const callback = useLazyCallback(() => {
		// Watch out for its stale closure however!
	});

	return null;
}
```

### `useStateRef()`

```tsx
import useStateRef from '@atlaskit/ds-lib/use-state-ref';

function Component() {
  const [valueRef, setState] = useStateRef(0);

  // Access the latest value, even inside stale closures.
  console.log(valueRef.current);

  // Update state as you would with use state
  return <div onClick={() => setState(prev => prev + 1)} />;
```

### `useScrollbarWidth()`

```tsx
import useScrollbarWidth from '@atlaskit/ds-lib/use-scrollbar-width';

function Component() {
	const scrollbar = useScrollbarWidth();

	return (
		// Use the scrollbar width in your styles/as you wish.
		// The ref should be attached to the scrollable element.
		<div id="container" style={{ padding: scrollbar.width }}>
			<div id="scrollable" ref={scrollbar.ref} />
		</div>
	);
}
```

### `useCloseOnEscapePress()`

**Notice: `useCloseOnEscapePress()` is deprecated, Please use `useCloseOnEscapePress` from
`@atlaskit/layering` instead.**

```tsx
import useCloseOnEscapePress from '@atlaskit/ds-lib/use-close-on-escape-press';

// Will callback when escape is pressed
useCloseOnEscapePress({
	onClose: () => {},
	isDisabled: false,
});
```

### `useAutoFocus()`

```tsx
import useAutoFocus from '@atlaskit/ds-lib/use-auto-focus';

const elementRef = useRef();
useAutoFocus(elementRef, true);

<div ref={elementRef} />;
```
