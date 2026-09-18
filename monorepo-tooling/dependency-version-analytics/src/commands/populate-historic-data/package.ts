import semver from 'semver';

import { type UpgradeEvent } from '../../types';
import { createUpgradeEvent, sendAnalytics } from '../../util/analytics';
import { type PackageVersionHistoryAndTagsType } from '../../util/get-package-version-history';
import getPackageVersionHistoryAndTags from '../../util/get-package-version-history';
import { type PopulateHistoricDataFlags } from './types';
import { getSupportedScopes, isPackageFromSupportedScopes } from './util/allowed-scopes';

export type PopulatePackageFlags = PopulateHistoricDataFlags & {
	since?: string;
	pkg: string;
};

const createAnalyticsEvents = (
	packageName: string,
	packageVersionHistoryAndTags: PackageVersionHistoryAndTagsType,
	since?: string,
): UpgradeEvent[] => {
	const packageVersionHistory = packageVersionHistoryAndTags['time'];
	const tags = packageVersionHistoryAndTags['dist-tags'];
	const sortedPackageVersionHistory = Object.entries(packageVersionHistory)
		.filter(([version]) => semver.valid(version))
		.sort((a, b) => Number(new Date(a[1])) - Number(new Date(b[1])));
	const upgradeEvents = sortedPackageVersionHistory
		.map(([version, time], i) => {
			if (since && Number(new Date(time)) <= Number(new Date(since))) {
				return null;
			}
			const previousVersion =
				sortedPackageVersionHistory[i - 1] && sortedPackageVersionHistory[i - 1][0];
			return createUpgradeEvent(
				packageName,
				version,
				previousVersion,
				time,
				{
					historical: true,
				},
				tags,
			);
		})
		.filter((e): e is UpgradeEvent => e != null);

	return upgradeEvents;
};

export default async function populatePackage(
	flags: PopulatePackageFlags,
): Promise<UpgradeEvent[]> {
	const supportedScopes = getSupportedScopes(flags.includeRestrictedScopes);

	if (!isPackageFromSupportedScopes(flags.pkg, supportedScopes)) {
		throw new Error(`Package must start with ${supportedScopes.join(', ')}`);
	}
	const packageVersionHistory = await getPackageVersionHistoryAndTags(flags.pkg);

	if (flags.since && Number.isNaN(Number(new Date(flags.since)))) {
		throw new Error(`'since' flag is an invalid date`);
	}

	const analyticsEvents = createAnalyticsEvents(flags.pkg, packageVersionHistory, flags.since);

	if (flags.dryRun) {
		console.log(JSON.stringify(analyticsEvents));
		return analyticsEvents;
	}

	await sendAnalytics(analyticsEvents, {
		dev: flags.dev,
		limit: flags.limit,
		product: 'atlaskit',
		skipPrompt: !flags.interactive,
	});

	return analyticsEvents;
}
