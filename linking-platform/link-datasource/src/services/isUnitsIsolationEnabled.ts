import { fg } from '@atlaskit/platform-feature-flags/fg';

import { getUnitsRolloutSettings } from './getUnitsRolloutSettings';

/**
 * Whether unit isolation behaviour should be applied for the current org.
 *
 * An org is isolated when units GA is on, the org has been opted in to the rollout - either by
 * org id or by cloud id - *and* the org has actually launched units with boundary enforcement
 * turned on:
 *
 * `cc-units-ga on -> (orgId gate on || cloudId gate on) -> endUsersLaunched && boundaryEnforced -> isolate`
 *
 * `cc-units-ga` is the units GA master gate and acts as the killswitch: while it is off nothing
 * else is evaluated and the current, non-isolated behaviour is kept. The AGG call is only made
 * when one of the rollout gates passes, so orgs outside of the rollout do not pay for an extra
 * request.
 */
export const isUnitsIsolationEnabled = async (): Promise<boolean> => {
	if (!fg('cc-units-ga')) {
		return false;
	}

	// Both rollout gates are always evaluated so that exposure is recorded consistently.
	const isOrgInRollout = fg('linking_platform_link_datasource_unit_compliant');
	const isCloudInRollout = fg('linking_platform_link_datasource_unit_compliant_cloud_id');

	if (!isOrgInRollout && !isCloudInRollout) {
		return false;
	}

	const { boundaryEnforced, endUsersLaunched } = await getUnitsRolloutSettings();

	return boundaryEnforced && endUsersLaunched;
};
