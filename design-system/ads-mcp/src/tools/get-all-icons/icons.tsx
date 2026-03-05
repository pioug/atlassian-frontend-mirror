import metadata from '@atlaskit/icon-lab/metadata';
import { coreIconMetadata } from '@atlaskit/icon/metadata';

// https://hello.atlassian.net/wiki/spaces/DST/pages/6558719954/Icon+content+type
export type IconMCPSchema = {
	keywords: string[];
	componentName: string;
	package: string;
	categorization: 'single-purpose' | 'multi-purpose';
	team: string;
	status?: 'draft' | 'ready-to-publish' | 'published' | 'modified' | 'deprecated' | undefined;
	usage?: string | undefined;
	shouldRecommendSmallIcon?: boolean | undefined;
};

export const icons: IconMCPSchema[] = [
	...Object.entries(coreIconMetadata).map(
		([_key, icon]: [string, coreIconMetadata]): IconMCPSchema => ({
			componentName: icon.componentName,
			package: icon.package,
			categorization: icon.categorization,
			keywords: icon.keywords,
			status: icon.status,
			usage: icon.usage,
			shouldRecommendSmallIcon: icon.shouldRecommendSmallIcon,
			team: icon.team,
		}),
	),
	...Object.entries(metadata).map(
		([_key, icon]: [string, metadata]): IconMCPSchema => ({
			componentName: icon.componentName,
			package: icon.package,
			categorization: icon.categorization, //???
			keywords: icon.keywords,
			status: icon.status,
			usage: icon.usage,
			shouldRecommendSmallIcon: icon.shouldRecommendSmallIcon,
			team: icon.team,
		}),
	),
];
