import chalk from 'chalk';
import type { LogResult } from 'simple-git';

import { DEFAULT_TAG } from '../../constants';
import { type UpgradeEvent } from '../../types';
import { createUpgradeEvent, sendAnalytics } from '../../util/analytics';
import { assert } from '../../util/assert';
import { getChangesSince, tagCommit, doesTagExist, refetchTag, getHash } from '../../util/git';
import * as statlas from '../../util/statlas';
import { DependencyStore } from './lib/dependency-store';
import { type PopulateHistoricDataFlags, type DependencyMap, type PackageChange } from './types';
import { getSupportedScopes } from './util/allowed-scopes';
import { generateCSV } from './util/generate-csv';

export type PopulateProductFlags = PopulateHistoricDataFlags & {
	csv: boolean;
	product: string;
	reset: boolean;
	statlas?: boolean;
	tag?: string;
	supportedPackages?: string;
	subWorkDir?: string;
};

const getUpgradeEventsFromPkgChange = (
	oldDeps: DependencyMap,
	newDeps: DependencyMap,
	{ date, commitHash }: { date: string; commitHash: string },
): UpgradeEvent[] => {
	const addOrUpgradeEvents = Object.entries(newDeps)
		.filter(([, { version }]) => !version.includes('alpha'))
		.map(([name, { version, type }]) => {
			const prevDep = oldDeps[name];
			// Only treat a dependency as previous if the dependency type matches
			// Otherwise, we want separate add/remove events
			const prevVersion = prevDep && prevDep.type === type ? prevDep.version : undefined;
			return createUpgradeEvent(name, version, prevVersion, date, {
				commitHash,
				dependencyType: type,
				historical: true,
			});
		})
		.filter((e): e is UpgradeEvent => e != null);

	const removeEvents = Object.entries(oldDeps)
		.filter(
			([name, { type }]) =>
				// Treat the same dep under a different dependency type as a new dep
				newDeps[name] == null || newDeps[name].type !== type,
		)
		.map(([name, { version, type }]) => {
			return createUpgradeEvent(name, undefined, version, date, {
				commitHash,
				dependencyType: type,
				historical: true,
			});
		})
		.filter((e): e is UpgradeEvent => e != null);

	return [...addOrUpgradeEvents, ...removeEvents];
};

const getEventsFromHistory = async (
	packageChangesLog: LogResult,
	prevRunHash: string | undefined,
	directoryOptions: { subWorkDir?: string },
	supportedScopes: string[],
	supportedPackages: string[],
): Promise<{
	allPackageChanges: PackageChange[];
	allUpgradeEvents: UpgradeEvent[];
}> => {
	const allPackageChanges: PackageChange[] = [];
	let allUpgradeEvents: UpgradeEvent[] = [];
	assert(packageChangesLog.all.length > 0, '');

	let dependencyStore = new DependencyStore({
		...directoryOptions,
		supportedScopes,
		supportedPackages,
	});
	let dependencies = await dependencyStore.initialise(prevRunHash);

	for (let i = 0; i < packageChangesLog.all.length; i++) {
		let item = packageChangesLog.all[i];

		if (allPackageChanges.length > 0) {
			dependencies = allPackageChanges[allPackageChanges.length - 1].deps;
		}
		const newDependencies = await dependencyStore.update({
			item,
			subWorkDir: directoryOptions.subWorkDir,
		});

		const packageChange = {
			date: new Date(item.date).toISOString(),
			deps: newDependencies,
		};
		const upgradeEvents = getUpgradeEventsFromPkgChange(dependencies, newDependencies, {
			date: packageChange.date,
			commitHash: item.hash,
		});

		if (upgradeEvents.length > 0) {
			allUpgradeEvents.push(...upgradeEvents);
			allPackageChanges.push(packageChange);
		}
	}
	return { allPackageChanges, allUpgradeEvents };
};

async function getSinceRef(flags: Pick<PopulateProductFlags, 'tag' | 'statlas' | 'product'>) {
	if (flags.statlas) {
		const meta = await statlas.getMeta(flags.product);
		if (!meta || !meta.lastRunHash) {
			throw new Error(
				chalk.red(
					`Missing or invalid metadata file for ${flags.product}. Must use --reset for populating from start of history`,
				),
			);
		}
		return meta.lastRunHash;
	} else {
		const tag = flags.tag || DEFAULT_TAG;
		await refetchTag(tag);
		const tagExists = await doesTagExist(tag);
		if (!tagExists) {
			throw new Error(
				chalk.red(
					`Tag '${tag}' does not exist. Must use --reset for populating from start of history.`,
				),
			);
		}
		return tag;
	}
}

export default async function populateProduct(flags: PopulateProductFlags): Promise<void> {
	console.log('running populateProduct with flags: ', flags);
	if (flags.cwd) {
		process.chdir(flags.cwd);
	}
	const sinceRef = flags.reset ? undefined : await getSinceRef(flags);
	console.log('sinceRef: ', sinceRef);
	const log = await getChangesSince(sinceRef);
	console.log('log: ', log);
	const supportedScopes = getSupportedScopes(flags.includeRestrictedScopes);
	const supportedPackages = flags.supportedPackages ? JSON.parse(flags.supportedPackages) : [];

	console.log(`Supported packages ${supportedPackages.length} and scopes ${supportedScopes}`);

	if (log.all.length === 0) {
		console.log(`No package.json changes found since '${sinceRef}'.`);
		return;
	}

	const { allPackageChanges, allUpgradeEvents } = await getEventsFromHistory(
		log,
		sinceRef,
		{ subWorkDir: flags.subWorkDir },
		supportedScopes,
		supportedPackages,
	);

	if (!allUpgradeEvents.length) {
		console.log(
			`Found no dependency changes from supported scopes ${supportedScopes.join(
				', ',
			)} since last run from ref "${sinceRef}"'`,
		);
	}

	if (flags.csv) {
		const csv = generateCSV(allPackageChanges);
		console.log('Generated csv: ', csv);
		return;
	}

	if (flags.dryRun) {
		console.log('All upgrade events: ', JSON.stringify(allUpgradeEvents));
		return;
	}

	if (allUpgradeEvents.length > 0) {
		await sendAnalytics(allUpgradeEvents, {
			dev: flags.dev,
			limit: flags.limit,
			product: flags.product,
			skipPrompt: !flags.interactive,
		});
	}

	if (flags.statlas) {
		// Upload latest commit to statlas
		const currentCommit = await getHash('HEAD');
		await statlas.uploadMeta(flags.product, currentCommit);
		console.log('Finished');
	} else {
		console.log('Updating tag to current commit...');
		await tagCommit(DEFAULT_TAG);
		console.log(`Finished. Run 'git push origin tag ${sinceRef}'.`);
	}
}
