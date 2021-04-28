# DSLib

This is an internal package with common functionality used in the Atlassian Design System Team.
This package comes with no support and semver guarantees,
your app will break if you use this directly!

## Installation

```sh
yarn add @atlaskit/ds-lib
```

## API

### `noop()`

```tsx
import noop from '@atlaskit/ds-lib/noop';

noop();
```

### `useLazyRef()`

```tsx
import useLazyRef from '@atlaskit/ds-lib/use-lazy-ref';

function expensiveFunction() {
  // Value returned after expensive calculations
}

function Component({ onClick }) {
  const ref = useLazyRef(() => expensiveFunction());
  return <button onClick={() => onClick(ref.current)}>Click me!</button>;
}
```

### `useLazyCallback()`

```tsx
import useLazyCallback from '@atlaskit/ds-lib/use-lazy-callback';

function Component() {
  const callback = useLazyCallback(() => {
    // `callback` always has the same reference.
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
