import { fg } from '@atlaskit/platform-feature-flags/fg';

import { getUnitsRolloutSettings } from './getUnitsRolloutSettings';

/**
 * Background
 * ----------
 * Once an organisation has been moved onto units ("launched") and has unit boundaries enforced,
 * its users may only see the sites that belong to their own unit. The site listing endpoints
 * linking platform calls do not filter by unit, so for those organisations we have to call the
 * unit compliant variant of the endpoint instead - that is the only behaviour change here.
 *
 * Whether an organisation is in that state is not something the browser can infer, so it is read
 * from AGG (see `getUnitsRolloutSettings`), and the rollout of the new call path is controlled by
 * feature gates on top of it.
 *
 * The decision
 * ------------
 * Both of these have to be true, and they are deliberately checked in this order:
 *
 * 1. The gates: `cc-units-ga` - the units GA master gate, owned by the units team, which is the
 *    killswitch for every product's units isolation behaviour - and `isProductInUnitsRollout()`,
 *    the calling product's own rollout gate. Each product rolls out at its own pace and has its
 *    own gate, so that check is passed in rather than living here. It is a callback, not a
 *    boolean, so that `&&` short circuits it away while the killswitch is off: that way we do not
 *    record product gate exposure for users who could not have received the behaviour anyway. It
 *    also has to be a callback because `fg` must be called with a literal gate name inside the
 *    package that declares that gate in its `package.json`, so a product cannot hand its gate
 *    name to this module as a string.
 *
 * 2. The organisation has actually launched units *and* has boundary enforcement on. Both come
 *    from AGG and both are required: an organisation part way through the migration can have
 *    launched without enforcement yet, and in that state the existing endpoints are still correct.
 *    This is the only step that makes a network call, and it is reached only for products that
 *    are already in the rollout.
 *
 * Anything unknown resolves to `false`, i.e. the existing, non unit compliant endpoint. That is
 * the safe direction: it is what every organisation gets today.
 */
export const shouldUseUnitCompliantApi = async (
	isProductInUnitsRollout: () => boolean,
): Promise<boolean> => {
	// 1. Units GA killswitch, then this product's own rollout gate.
	if (!(fg('cc-units-ga') && isProductInUnitsRollout())) {
		return false;
	}

	// 2. This organisation's actual units state, read from AGG once per page load.
	const { boundaryEnforced, endUsersLaunched } = await getUnitsRolloutSettings();

	return endUsersLaunched && boundaryEnforced;
};
