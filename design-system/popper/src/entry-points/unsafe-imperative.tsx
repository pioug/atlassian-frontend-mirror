/**
 * UNSAFE compatibility entry point. `createPopper` for non-React, imperative
 * consumers moving direct `@popperjs/core` dependency ownership onto
 * `@atlaskit/popper`.
 *
 * Do not use this for new code. New overlays should build on
 * `@atlaskit/top-layer` directly: `Popover` + `useAnchorPosition`. top-layer
 * has no imperative positioning API and is not getting one — see
 * `top-layer/notes/migrations/popper-migration.md` -> "Decision: popper brings
 * its own React".
 *
 * Behind the `platform-dst-top-layer` feature gate this returns a top-layer
 * backed instance: the element is positioned with CSS Anchor Positioning and
 * lifted into the browser top layer. Flag-off it is the raw Popper.js v2
 * engine. See `createPopperTopLayer` for the option-handling tiers.
 */
import { createPopper as createLegacyPopper } from '@popperjs/core';

import { fg } from '@atlaskit/platform-feature-flags/fg';

import { createPopperTopLayer } from '../create-popper-top-layer';

// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- TIERS-3 tracks the @atlaskit/popper Popper.js consolidation and top-layer migration; this entry point is an intentional escape hatch for existing imperative callers, not a public API.
/**
 * `createPopper` for non-React, imperative callers.
 *
 * Behind `platform-dst-top-layer` this returns a top-layer–backed instance — positioned with CSS
 * Anchor Positioning and lifted into the browser top layer via a detached React root. Flag-off it
 * is the raw Popper.js v2 engine. Either way the first positioning update is asynchronous, so keep
 * the element hidden until a later frame. See `createPopperTopLayer` for option handling.
 *
 * @deprecated Escape hatch for existing imperative Popper.js callers only. Do not use for new
 * code — build on `@atlaskit/top-layer` (`Popover` + `useAnchorPosition`) instead. Tracked by
 * TIERS-3.
 */
export const createPopper: typeof createLegacyPopper = (reference, popper, options) => {
	if (fg('platform-dst-top-layer')) {
		return createPopperTopLayer(reference, popper, options);
	}
	return createLegacyPopper(reference, popper, options);
};

export type { Instance, State } from '@popperjs/core';
