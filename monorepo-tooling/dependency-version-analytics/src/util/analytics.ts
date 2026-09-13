import chalk from 'chalk';
import inquirer from 'inquirer';
import semver from 'semver';
/* eslint-disable-next-line @repo/internal/import/no-unresolved */
import { analyticsClient } from '@atlassiansox/analytics-node-client';
import {
	type UpgradeEvent,
	type DependencyType,
	type UpgradeType,
	type UpgradeSubType,
	type DistTagsType,
} from '../types';

function getUpgradeType(
	version: string | undefined,
	previousVersion: string | undefined,
): UpgradeType | null {
	if (previousVersion == null && version != null) {
		return 'add';
	} else if (previousVersion != null && version == null) {
		return 'remove';
	} else if (previousVersion != null && version != null && previousVersion !== version) {
		const coercedPrevious: any = semver.coerce(previousVersion);
		const coercedNew: any = semver.coerce(version);
		if (coercedNew == null) {
			console.error(`Found invalid version "${version}", skipping`);
			return null;
		}
		if (coercedPrevious != null && semver.lt(coercedNew, coercedPrevious)) {
			return 'downgrade';
		} else {
			return 'upgrade';
		}
	} else {
		return null;
	}
}

function getUpgradeSubType(
	version: string | undefined,
	previousVersion: string | undefined,
): UpgradeSubType {
	let upgradeSubType: UpgradeSubType | null = null;
	if (version == null || previousVersion == null) {
		return upgradeSubType;
	}

	const parsedOld = semver.coerce(previousVersion);
	const parsedNew = semver.coerce(version);
	if (parsedOld && parsedNew) {
		upgradeSubType = semver.diff(parsedOld.version, parsedNew.version);
	}

	return upgradeSubType;
}

// optionalEventArgs will be included within the event.
export function createUpgradeEvent(
	name: string,
	version: string | undefined,
	previousVersion: string | undefined,
	date: string,
	optionalEventArgs: {
		commitHash?: string;
		dependencyType?: DependencyType;
		historical?: boolean;
	} = {},
	tags: DistTagsType = {},
): UpgradeEvent | null {
	if (Number.isNaN(Date.parse(date))) {
		throw new Error(`Invalid date: '${date}'`);
	}
	const upgradeType = getUpgradeType(version, previousVersion);
	if (!upgradeType) {
		// Not an upgrade for this dependency, return null
		return null;
	}
	const upgradeSubType = getUpgradeSubType(version, previousVersion);
	const eventVersion = (upgradeType !== 'remove' ? version : previousVersion) as string;
	const parsedVersion = semver.coerce(eventVersion);
	let rcKey = null;
	Object.keys(tags).forEach((key) => {
		if (key.startsWith('rc')) {
			rcKey = key;
			return;
		}
	});

	return {
		cliVersion: process.env._PACKAGE_VERSION_,
		dependencyName: name,
		versionString: eventVersion,
		major: parsedVersion ? `${parsedVersion.major}` : null,
		minor: parsedVersion ? `${parsedVersion.minor}` : null,
		patch: parsedVersion ? `${parsedVersion.patch}` : null,
		date: new Date(date).toISOString(),
		upgradeType,
		upgradeSubType,
		latestTag: (tags && tags['latest']) ?? null,
		nextTag: tags['next'] ?? null,
		hotfixTag: tags['hotfix'] ?? null,
		rcTag: (rcKey && tags[rcKey]) ?? null,
		...optionalEventArgs,
	};
}

export async function sendAnalytics(
	analyticsEvents: UpgradeEvent[],
	{
		dev,
		limit,
		product,
		skipPrompt,
	}: { dev?: boolean; limit?: number; product: string; skipPrompt?: boolean },
): Promise<void> {
	const analyticsEnv = dev ? 'dev' : 'prod';
	const eventsToSend = limit != null ? analyticsEvents.slice(0, limit) : analyticsEvents;

	const client = analyticsClient({
		env: dev ? 'dev' : 'prod',
		product: product,
	});

	if (!skipPrompt) {
		const answers: any = await inquirer.prompt([
			{
				type: 'confirm',
				name: 'continue',
				message: `Are you sure you want to send ${eventsToSend.length} historical analytics events to '${analyticsEnv}' env for product '${product}?`,
				default: false,
			},
		]);

		if (!answers.continue) {
			console.log('Aborting');
			process.exit(0);
		}
	}

	try {
		const promises = await Promise.all(
			eventsToSend.map((event) => {
				return client.sendTrackEvent({
					anonymousId: 'unknown',
					trackEvent: {
						tags: ['atlaskit'],
						source: '@atlaskit/dependency-version-analytics',
						action: 'upgraded',
						actionSubject: 'akDependency',
						attributes: {
							...event,
						},
						origin: 'console',
						platform: 'bot',
					},
				});
			}),
		);
		console.log(chalk.green(`Sent ${promises.length} dependency version upgrade analytics events`));
	} catch (e) {
		console.error(chalk.red('Sending analytics failed'));
		console.error(e);
		process.exit(1);
	}
}
