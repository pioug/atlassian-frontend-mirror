/**
 * Codemod: migrate-to-entry-points
 *
 * Migrates imports from the `@atlaskit/logo` barrel (index) to their
 * dedicated entry-points, as defined in the package `exports` map.
 *
 * Example:
 *   import { BitbucketIcon } from '@atlaskit/logo';
 *   → import { BitbucketIcon } from '@atlaskit/logo/bitbucket/icon';
 *
 * Usage (via @atlaskit/codemod-cli):
 *   npx @atlaskit/codemod-cli --packages @atlaskit/logo@21.7.0 <path-to-your-source>
 */
import type {
	API,
	ASTPath,
	ExportNamedDeclaration,
	ExportSpecifier,
	FileInfo,
	ImportDeclaration,
	ImportSpecifier,
} from 'jscodeshift';

export const parser = 'tsx' as const;

const LOGO_PACKAGE = '@atlaskit/logo';

/**
 * Barrel export name → package sub-path (from package.json `"exports"`).
 *
 * Prefer nested entry-points (`bitbucket/icon`) over the older kebab paths
 * (`bitbucket-icon`) when both exist.
 *
 * Symbols omitted from this map stay on the root barrel (for example
 * `LoomAttributionIcon`, which has no dedicated icon entry-point, and
 * deprecated aliases such as `AtlassianAdminIcon`).
 */
const SYMBOL_TO_ENTRY_POINT: Record<string, string> = {
	LogoProps: 'types',

	AdminIcon: 'admin/icon',
	AdminLogo: 'admin/logo',
	AlignIcon: 'align/icon',
	AlignLogo: 'align/logo',
	AnalyticsIcon: 'analytics/icon',
	AnalyticsLogo: 'analytics/logo',
	AssetsIcon: 'assets/icon',
	AssetsLogo: 'assets/logo',
	BambooIcon: 'bamboo/icon',
	BambooLogo: 'bamboo/logo',
	BitbucketIcon: 'bitbucket/icon',
	BitbucketLogo: 'bitbucket/logo',
	BitbucketDataCenterIcon: 'bitbucket-data-center/icon',
	BitbucketDataCenterLogo: 'bitbucket-data-center/logo',
	ChatIcon: 'chat/icon',
	ChatLogo: 'chat/logo',
	CompanyHubIcon: 'company-hub/icon',
	CompanyHubLogo: 'company-hub/logo',
	CompassIcon: 'compass/icon',
	CompassLogo: 'compass/logo',
	ConfluenceIcon: 'confluence/icon',
	ConfluenceLogo: 'confluence/logo',
	ConfluenceDataCenterIcon: 'confluence-data-center/icon',
	ConfluenceDataCenterLogo: 'confluence-data-center/logo',
	CrowdIcon: 'crowd/icon',
	CrowdLogo: 'crowd/logo',
	CustomLinkIcon: 'custom-link/icon',
	CustomerServiceManagementIcon: 'customer-service-management/icon',
	CustomerServiceManagementLogo: 'customer-service-management/logo',
	DxIcon: 'dx/icon',
	FeedbackIcon: 'feedback/icon',
	FeedbackLogo: 'feedback/logo',
	FocusIcon: 'focus/icon',
	FocusLogo: 'focus/logo',
	GoalsIcon: 'goals/icon',
	GoalsLogo: 'goals/logo',
	GuardIcon: 'guard/icon',
	GuardLogo: 'guard/logo',
	GuardDetectIcon: 'guard-detect/icon',
	GuardDetectLogo: 'guard-detect/logo',
	HomeIcon: 'home/icon',
	HomeLogo: 'home/logo',
	HubIcon: 'hub/icon',
	HubLogo: 'hub/logo',
	InsightsIcon: 'insights/icon',
	InsightsLogo: 'insights/logo',
	JiraIcon: 'jira/icon',
	JiraLogo: 'jira/logo',
	JiraCodingAgentIcon: 'jira-coding-agent/icon',
	JiraDataCenterIcon: 'jira-data-center/icon',
	JiraDataCenterLogo: 'jira-data-center/logo',
	JiraProductDiscoveryIcon: 'jira-product-discovery/icon',
	JiraProductDiscoveryLogo: 'jira-product-discovery/logo',
	JiraServiceManagementIcon: 'jira-service-management/icon',
	JiraServiceManagementLogo: 'jira-service-management/logo',
	JiraServiceManagementDataCenterIcon: 'jira-service-management-data-center/icon',
	JiraServiceManagementDataCenterLogo: 'jira-service-management-data-center/logo',
	LoomIcon: 'loom/icon',
	LoomLogo: 'loom/logo',
	LoomAttributionLogo: 'loom-attribution/logo',
	LoomBlurpleIcon: 'loom-internal/icon',
	LoomBlurpleLogo: 'loom-internal/logo',
	MoreAtlassianAppsIcon: 'more-atlassian-apps/icon',
	OpsgenieIcon: 'opsgenie/icon',
	OpsgenieLogo: 'opsgenie/logo',
	ProjectsIcon: 'projects/icon',
	ProjectsLogo: 'projects/logo',
	RovoIcon: 'rovo/icon',
	RovoLogo: 'rovo/logo',
	RovoDevIcon: 'rovo-dev/icon',
	RovoDevLogo: 'rovo-dev/logo',
	RovoDevAgentIcon: 'rovo-dev-agent/icon',
	RovoDevAgentLogo: 'rovo-dev-agent/logo',
	SearchIcon: 'search/icon',
	SearchLogo: 'search/logo',
	StatuspageIcon: 'statuspage/icon',
	StatuspageLogo: 'statuspage/logo',
	StudioIcon: 'studio/icon',
	StudioLogo: 'studio/logo',
	TalentIcon: 'talent/icon',
	TalentLogo: 'talent/logo',
	TeamsIcon: 'teams/icon',
	TeamsLogo: 'teams/logo',
	TrelloIcon: 'trello/icon',
	TrelloLogo: 'trello/logo',

	AtlasIcon: 'atlas-icon',
	AtlasLogo: 'logo',
	AtlassianIcon: 'atlassian-icon',
	AtlassianLogo: 'atlassian/logo',
	AtlassianAccessIcon: 'atlassian-access/icon',
	AtlassianAccessLogo: 'atlassian-access/logo',
	AtlassianMarketplaceIcon: 'atlassian-marketplace/icon',
	AtlassianMarketplaceLogo: 'atlassian-marketplace/logo',
	JiraSoftwareIcon: 'jira-software-icon',
	JiraSoftwareLogo: 'jira-software/logo',
	JiraWorkManagementIcon: 'jira-work-management/icon',
	JiraWorkManagementLogo: 'jira-work-management/logo',
};

function getImportedName(specifier: ImportSpecifier): string {
	return specifier.imported.type === 'Identifier'
		? specifier.imported.name
		: // @ts-expect-error String-literal imported names (TS 4.5+ import type syntax)
			specifier.imported.value;
}

function getExportedName(specifier: ExportSpecifier): string {
	if (specifier.local) {
		return specifier.local.name;
	}
	return specifier.exported.type === 'Identifier'
		? specifier.exported.name
		: // @ts-expect-error String-literal exported names
			specifier.exported.value;
}

export default function transformer(file: FileInfo, api: API): string {
	if (/\/(prebuilt|dist|node_modules)\//.test(file.path)) {
		return file.source;
	}

	const j = api.jscodeshift;
	const source = j(file.source);

	let fileHasChanges = false;

	source.find(j.ImportDeclaration, { source: { value: LOGO_PACKAGE } }).forEach((path) => {
		if (rewriteImportDeclaration(j, path)) {
			fileHasChanges = true;
		}
	});

	source
		.find(j.ExportNamedDeclaration, { source: { value: LOGO_PACKAGE } })
		.forEach((path: ASTPath<ExportNamedDeclaration>) => {
			if (rewriteExportDeclaration(j, path)) {
				fileHasChanges = true;
			}
		});

	return fileHasChanges ? source.toSource({ useTabs: true, quote: 'single' }) : file.source;
}

function rewriteImportDeclaration(
	j: API['jscodeshift'],
	path: ASTPath<ImportDeclaration>,
): boolean {
	const specifiers = path.node.specifiers ?? [];
	const keepInRoot: NonNullable<ImportDeclaration['specifiers']> = [];
	const byEntryPoint = new Map<string, NonNullable<ImportDeclaration['specifiers']>>();

	for (const specifier of specifiers) {
		if (
			specifier.type === 'ImportDefaultSpecifier' ||
			specifier.type === 'ImportNamespaceSpecifier'
		) {
			keepInRoot.push(specifier);
			continue;
		}
		if (specifier.type !== 'ImportSpecifier') {
			keepInRoot.push(specifier);
			continue;
		}

		const importedName = getImportedName(specifier);
		const entryPoint = SYMBOL_TO_ENTRY_POINT[importedName];
		if (!entryPoint) {
			keepInRoot.push(specifier);
			continue;
		}
		const group = byEntryPoint.get(entryPoint) ?? [];
		group.push(specifier);
		byEntryPoint.set(entryPoint, group);
	}

	if (byEntryPoint.size === 0) {
		return false;
	}

	const isTypeImport =
		(path.node as ImportDeclaration & { importKind?: string }).importKind === 'type';

	const newDeclarations = Array.from(byEntryPoint.entries()).map(([entryPoint, specs]) => {
		const entrySource = `${LOGO_PACKAGE}/${entryPoint}`;
		let allTypes = isTypeImport;
		if (!allTypes) {
			allTypes = specs.every(
				(s) =>
					s.type === 'ImportSpecifier' &&
					(s as ImportSpecifier & { importKind?: string }).importKind === 'type',
			);
		}

		const clonedSpecs = specs.map((s) => {
			if (s.type !== 'ImportSpecifier') {
				return s;
			}
			const importedName = getImportedName(s);
			const hasAlias = Boolean(s.local && s.local.name !== importedName);
			const cloned = hasAlias
				? j.importSpecifier(j.identifier(importedName), j.identifier(s.local!.name))
				: j.importSpecifier(j.identifier(importedName));
			if (!allTypes && (s as ImportSpecifier & { importKind?: string }).importKind === 'type') {
				(cloned as ImportSpecifier & { importKind?: string }).importKind = 'type';
			}
			return cloned;
		});

		const newDecl = j.importDeclaration(clonedSpecs, j.stringLiteral(entrySource));
		if (allTypes) {
			newDecl.importKind = 'type';
		}
		return newDecl;
	});

	replaceOrSplit(j, path, keepInRoot, newDeclarations);
	return true;
}

function rewriteExportDeclaration(
	j: API['jscodeshift'],
	path: ASTPath<ExportNamedDeclaration>,
): boolean {
	const specifiers = (path.node.specifiers ?? []) as ExportSpecifier[];
	const keepInRoot: ExportSpecifier[] = [];
	const byEntryPoint = new Map<string, ExportSpecifier[]>();

	for (const specifier of specifiers) {
		const exportedName = getExportedName(specifier);
		const entryPoint = SYMBOL_TO_ENTRY_POINT[exportedName];
		if (!entryPoint) {
			keepInRoot.push(specifier);
			continue;
		}
		const group = byEntryPoint.get(entryPoint) ?? [];
		group.push(specifier);
		byEntryPoint.set(entryPoint, group);
	}

	if (byEntryPoint.size === 0) {
		return false;
	}

	const isTypeExport =
		(path.node as ExportNamedDeclaration & { exportKind?: string }).exportKind === 'type';

	const newDeclarations = Array.from(byEntryPoint.entries()).map(([entryPoint, specs]) => {
		const newDecl = j.exportNamedDeclaration(
			null,
			specs,
			j.stringLiteral(`${LOGO_PACKAGE}/${entryPoint}`),
		);
		if (isTypeExport) {
			(newDecl as ExportNamedDeclaration & { exportKind?: string }).exportKind = 'type';
		}
		return newDecl;
	});

	replaceOrSplit(j, path, keepInRoot, newDeclarations);
	return true;
}

function replaceOrSplit(
	j: API['jscodeshift'],
	path: ASTPath<ImportDeclaration> | ASTPath<ExportNamedDeclaration>,
	keepInRoot: unknown[],
	newDeclarations: Array<ImportDeclaration | ExportNamedDeclaration>,
): void {
	if (keepInRoot.length > 0) {
		path.node.specifiers = keepInRoot as typeof path.node.specifiers;
		j(path).insertAfter([...newDeclarations].reverse());
		return;
	}

	const nodeWithComments = path.node as { comments?: Array<{ leading?: boolean }> };
	const leadingComments = nodeWithComments.comments?.filter((c) => c.leading);
	if (leadingComments?.length) {
		const firstNew = newDeclarations[0] as { comments?: unknown[] };
		firstNew.comments = [...leadingComments, ...(firstNew.comments ?? [])];
		nodeWithComments.comments = nodeWithComments.comments?.filter((c) => !c.leading);
	}
	j(path).insertBefore(newDeclarations);
	j(path).remove();
}
