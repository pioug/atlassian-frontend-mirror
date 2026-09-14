/**
 * Largely taken from analytics-web-react
 */

import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';

import { getPackageInfo } from './get-package-info';

// This function scans the whole context and looks for context data that includes packageName at the root of the object.
// Every package should include this info once, just to differentiate between packages, but no between internal components of each package
// If no context data brings a packageName, the map function retuns an empty string that is replaced for "undefined"
export function getPackageHierarchy(event: UIAnalyticsEvent): string | undefined {
	const packages = getPackageInfo(event) || [];
	return (
		packages
			.map((p) => (p.packageVersion ? `${p.packageName}@${p.packageVersion}` : p.packageName))
			.join(',') || undefined
	);
}
