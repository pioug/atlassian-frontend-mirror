Pass `getServerSnapshot` as the third argument to `useSyncExternalStore`. Its value is used for
server rendering and initial client hydration, so both must agree. It must also match the component's
snapshot type and be handled by its rendering logic.

A stable fallback such as `null` does **not** prevent the component from rendering on the server.
Choose a meaningful initial value or an explicit loading state; do not read browser-only APIs in
`getServerSnapshot`. Follow the [React reference](https://react.dev/reference/react/useSyncExternalStore)
for transferring preloaded store data to the client.

```jsx
import { useSyncExternalStore } from 'react';

function Status({ subscribe, getSnapshot, initialStatus }) {
	const status = useSyncExternalStore(subscribe, getSnapshot, () => initialStatus);
	return <span>{status}</span>;
}
```

Supply the same serialized `initialStatus` to the server and hydrating client. A genuinely client-only
component needs the product's supported client-rendering boundary; a null snapshot alone does not
provide one.
