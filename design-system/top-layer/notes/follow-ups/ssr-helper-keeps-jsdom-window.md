# Follow-up: the `@atlaskit/ssr` helper keeps the jsdom `window`

**Status:** open. Tests opt out of the warning for now.

## Problem

`ssr()` in `build/test-tooling/ssr/src/emotion.tsx` renders a component to a string inside a jsdom
test. It tries to act like a server with `global.window = {}`. That does not work:

1. jsdom defines `window` as a getter on the global, so the assignment leaves the jsdom `window` in
   place.
2. Even if it worked, `{}` is not `undefined`.

`@atlaskit/ds-lib/use-layout-effect` picks `useEffect` only when `typeof window === 'undefined'` as
it loads. In `ssr()` it sees a `window`, so it picks React's `useLayoutEffect`. React 18 then logs
"useLayoutEffect does nothing on the server" for each layout effect in the server render.

A real server has no `window`, so the same code logs nothing there.

## When it shows

With `platform-dst-top-layer` on, a top-layer `FlagGroup` that has a flag on its first render puts
its `Popover` in the server render (`flag/src/flag-group.tsx`). The `Popover` hooks then log 7 of
these errors. The user sees nothing different: a popover stays hidden until the client calls
`showPopover()`, and legacy put nothing in the server HTML.

Tests that opt out of the warning today:

- `growth/invite-prompt/__tests__/unit/ssr.tsx` and
  `growth/invite-on-third-party-link/__tests__/unit/ssr.tsx` (top-layer flag group)
- earlier, for other reasons: `identity/account-menu`, `media/media-picker`, `media/media-svg`,
  `ai-mate/agent-studio-auth`, `mercury/focus-area-glance-panel`

## Proposed fix

In `ssr()`, load `@atlaskit/ds-lib/use-layout-effect` with no `window`, then put the jsdom `window`
back exactly. `ssr()` calls `jest.resetModules()` first, and hydration resets the registry again, so
only the server render gets the server version.

```ts
const windowDescriptor = Object.getOwnPropertyDescriptor(global, 'window');
// @ts-expect-error
delete global.window;
try {
	require('@atlaskit/ds-lib/use-layout-effect');
} finally {
	if (windowDescriptor) {
		Object.defineProperty(global, 'window', windowDescriptor);
	}
}
```

This was tried on `areardon/top-layer-tests-harness` and passed CI, then left out of PR #529589 to
keep the shared helper unchanged. It needs:

- a `@atlaskit/ds-lib` dependency and tsconfig reference in `@atlaskit/ssr`
- a check that the 77 suites that use `ssr()` still pass

Once it lands, remove the opt-outs above where the warning was their only reason.

## Rejected

- **Delete `window` for the whole server render.** 13 of the 77 `ssr()` suites failed, because code
  in them needs a `window` at load time.
- **Make ds-lib decide at call time.** That is a runtime change for every consumer, to fix a test
  helper.
- **Render no top-layer `FlagGroup` on the server.** The user sees the same result either way, so a
  component change is not worth it.
