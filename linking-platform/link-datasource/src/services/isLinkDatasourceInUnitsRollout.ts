import { fg } from '@atlaskit/platform-feature-flags/fg';

/**
 * Whether link datasource is in the units isolation rollout.
 *
 * Two gates drive the same rollout so it can be turned on for either an organisation or a single
 * site: `..._unit_compliant` targets org id, `..._unit_compliant_cloud_id` targets cloud id.
 * Either one being on opts link datasource in, and both are always evaluated so that exposure is
 * recorded for the two of them.
 *
 * Being in the rollout is not on its own enough to change behaviour - the organisation also has to
 * have launched units with boundary enforcement on. Pass this to `shouldUseUnitCompliantApi` from
 * `@atlaskit/linking-common/units-rollout`, which owns that decision, rather than calling it
 * directly.
 */
export const isLinkDatasourceInUnitsRollout = (): boolean => {
	const isOrgInRollout = fg('linking_platform_link_datasource_unit_compliant');
	const isSiteInRollout = fg('linking_platform_link_datasource_unit_compliant_cloud_id');

	return isOrgInRollout || isSiteInRollout;
};
