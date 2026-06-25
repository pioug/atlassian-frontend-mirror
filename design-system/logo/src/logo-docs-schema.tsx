export type LogoDocsSchema = {
	name: string;
	type: 'legacy' | 'migration' | 'new' | 'rovo-hex';
	category: 'program' | 'app' | 'agent';
	skipExample?: boolean;
	skipLogo?: boolean;
	deprecated?: boolean;
};

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const logoDocsSchema: LogoDocsSchema[] = [
	// Program logos
	{ name: 'atlassian', type: 'legacy', category: 'program' },
	{ name: 'atlassian-access', type: 'legacy', category: 'program' },
	{ name: 'atlassian-marketplace', type: 'legacy', category: 'program' },
	// Home collection
	{ name: 'home', type: 'new', category: 'app' },
	{ name: 'hub', type: 'new', category: 'app' },
	// Teamwork collection
	{ name: 'confluence', type: 'migration', category: 'app' },
	{ name: 'jira', type: 'migration', category: 'app' },
	{ name: 'loom', type: 'migration', category: 'app' },
	{ name: 'loom-blurple', type: 'new', category: 'app', skipExample: true },
	{ name: 'loom-attribution', type: 'migration', category: 'app' },
	{ name: 'jira-coding-agent', type: 'new', category: 'agent', skipLogo: true },
	{ name: 'rovo', type: 'rovo-hex', category: 'app' },
	// Strategy collection
	{ name: 'align', type: 'new', category: 'app' },
	{ name: 'focus', type: 'migration', category: 'app' },
	{ name: 'talent', type: 'new', category: 'app' },
	// App collection
	{ name: 'jira-product-discovery', type: 'migration', category: 'app' },
	// Dev collection
	{ name: 'bitbucket', type: 'migration', category: 'app' },
	{ name: 'compass', type: 'migration', category: 'app' },
	{ name: 'dx', type: 'new', category: 'app', skipLogo: true },
	{ name: 'rovo-dev', type: 'new', category: 'app' },
	{ name: 'rovo-dev-agent', type: 'new', category: 'agent' },
	// Customer collection
	{ name: 'jira-service-management', type: 'migration', category: 'app' },
	{ name: 'assets', type: 'new', category: 'app' },
	{ name: 'customer-service-management', type: 'new', category: 'app' },
	{ name: 'opsgenie', type: 'migration', category: 'app' },
	{ name: 'statuspage', type: 'migration', category: 'app' },
	{ name: 'trello', type: 'migration', category: 'app' },
	// Platform Collection
	{ name: 'admin', type: 'new', category: 'app' },
	{ name: 'analytics', type: 'new', category: 'app' },
	{ name: 'chat', type: 'new', category: 'app' },
	{ name: 'feedback', type: 'new', category: 'app' },
	{ name: 'goals', type: 'new', category: 'app' },
	{ name: 'guard', type: 'migration', category: 'app' },
	{ name: 'projects', type: 'new', category: 'app' },
	{ name: 'search', type: 'new', category: 'app' },
	{ name: 'studio', type: 'new', category: 'app' },
	{ name: 'teams', type: 'new', category: 'app' },
	{ name: 'company-hub', type: 'new', category: 'app' },
	{ name: 'custom-link', type: 'new', category: 'app', skipLogo: true },
	{ name: 'guard-detect', type: 'new', category: 'app' },
	{ name: 'more-atlassian-apps', type: 'new', category: 'app', skipLogo: true },
	// Data Center
	{ name: 'jira-data-center', type: 'new', category: 'app' },
	{ name: 'jira-service-management-data-center', type: 'new', category: 'app' },
	{ name: 'confluence-data-center', type: 'new', category: 'app' },
	{ name: 'bitbucket-data-center', type: 'new', category: 'app' },
	{ name: 'bamboo', type: 'new', category: 'app' },
	{ name: 'crowd', type: 'new', category: 'app' },
	// Deprecated
	{
		name: 'atlassian-administration',
		type: 'legacy',
		category: 'app',
		skipExample: true,
		deprecated: true,
	},
	{ name: 'atlassian-admin', type: 'legacy', category: 'app', skipExample: true, deprecated: true },
	{
		name: 'atlassian-analytics',
		type: 'legacy',
		category: 'app',
		skipExample: true,
		deprecated: true,
	},
	{ name: 'atlas', type: 'legacy', category: 'app', skipExample: true, deprecated: true },
	{ name: 'jira-align', type: 'legacy', category: 'app', skipExample: true, deprecated: true },
	{ name: 'jira-software', type: 'legacy', category: 'app', skipExample: true, deprecated: true },
	{
		name: 'jira-work-management',
		type: 'legacy',
		category: 'app',
		skipExample: true,
		deprecated: true,
	},
] as const;

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const PROGRAM_LOGO_DOCS_ORDER: string[] = logoDocsSchema
	.filter((logo) => logo.category === 'program' && !logo.skipExample)
	.map((logo) => logo.name);
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const APP_LOGO_DOCS_ORDER: string[] = logoDocsSchema
	.filter((logo) => logo.category === 'app' && !logo.skipExample)
	.map((logo) => logo.name);
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const AGENT_LOGO_DOCS_ORDER: string[] =
	logoDocsSchema
		.filter((logo) => logo.category === 'agent' && !logo.skipExample)
		.map((logo) => logo.name) || [];

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const LEGACY_ONLY_LOGOS: LogoDocsSchema[] = logoDocsSchema.filter(
	(logo) => logo.type === 'legacy',
);
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const SHARED_LOGOS: LogoDocsSchema[] = logoDocsSchema.filter(
	(logo) => logo.type === 'migration',
);
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const NEW_ONLY_LOGOS: LogoDocsSchema[] = logoDocsSchema.filter(
	(logo) => logo.type === 'new',
);
