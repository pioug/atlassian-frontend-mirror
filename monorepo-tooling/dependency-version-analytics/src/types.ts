import { type ReleaseType } from 'semver';

export type DependencyType =
	| 'devDependency'
	| 'dependency'
	| 'optionalDependency'
	| 'peerDependency';
export type UpgradeType = 'add' | 'upgrade' | 'remove' | 'downgrade';
export type UpgradeSubType = ReleaseType | null;

// go/dataportal/analytics/registry/17058
export type UpgradeEvent = {
	dependencyName: string;
	versionString: string;
	major: string | null;
	minor: string | null;
	patch: string | null;
	date: string;
	upgradeType: UpgradeType;
	upgradeSubType: UpgradeSubType;
	cliVersion: string;
	latestTag: string | null;
	nextTag: string | null;
	hotfixTag: string | null;
	rcTag: string | null;
	dependencyType?: DependencyType;
	historical?: boolean;
	commitHash?: string;
};

export type DistTagsType = {
	[tag: string]: string;
};
