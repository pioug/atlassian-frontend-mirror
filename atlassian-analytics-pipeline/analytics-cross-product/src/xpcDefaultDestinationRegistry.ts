import {
	type XpcDestinationRegistry,
	XpcDestinationResolver,
	type XpcProductId,
} from './xpcDestinationResolver';

export type XpcDefaultDestinationRegistryOptions = {
	localhostProduct?: XpcProductId;
};

const product = {
	admin: XpcDestinationResolver.createProductId('admin'),
	confluence: XpcDestinationResolver.createProductId('confluence'),
	home: XpcDestinationResolver.createProductId('home'),
	jira: XpcDestinationResolver.createProductId('jira'),
	studio: XpcDestinationResolver.createProductId('studio'),
};

const routeFamily = {
	admin: XpcDestinationResolver.createRouteFamily('admin'),
	confluenceContent: XpcDestinationResolver.createRouteFamily('content-page'),
	home: XpcDestinationResolver.createRouteFamily('home'),
	jiraIssue: XpcDestinationResolver.createRouteFamily('issue-view'),
	jiraProduct: XpcDestinationResolver.createRouteFamily('jira-product'),
	studio: XpcDestinationResolver.createRouteFamily('studio'),
};

/**
 * The initial shared, deliberately narrow destination taxonomy.
 *
 * Recognized Atlassian hosts without one of these exact route matches remain
 * unknown and do not enter the confirmed cross-product denominator.
 */
export const createXpcDefaultDestinationRegistry = ({
	localhostProduct,
}: XpcDefaultDestinationRegistryOptions = {}): XpcDestinationRegistry => ({
	allowedHttpHosts: localhostProduct ? ['localhost'] : [],
	atlassianHostSuffixes: ['atlassian.com', 'atlassian.net', 'atl-paas.net'],
	rules: [
		...(localhostProduct
			? [
					{
						host: 'localhost',
						id: XpcDestinationResolver.createMatcherId('local-product'),
						precedence: 200,
						product: localhostProduct,
						routeFamily: XpcDestinationResolver.createRouteFamily('local-product'),
					},
				]
			: []),
		{
			host: 'studio.atlassian.com',
			id: XpcDestinationResolver.createMatcherId('studio-production'),
			precedence: 200,
			product: product.studio,
			routeFamily: routeFamily.studio,
		},
		{
			host: 'studio-next.atlassian.com',
			id: XpcDestinationResolver.createMatcherId('studio-next-production'),
			precedence: 200,
			product: product.studio,
			routeFamily: routeFamily.studio,
		},
		{
			host: 'studio.stg.atlassian.com',
			id: XpcDestinationResolver.createMatcherId('studio-staging'),
			precedence: 200,
			product: product.studio,
			routeFamily: routeFamily.studio,
		},
		{
			host: 'atlassian.net',
			hostMatch: 'suffix',
			id: XpcDestinationResolver.createMatcherId('confluence-wiki-route'),
			pathPrefix: '/wiki',
			precedence: 100,
			product: product.confluence,
			routeFamily: routeFamily.confluenceContent,
		},
		{
			host: 'atlassian.net',
			hostMatch: 'suffix',
			id: XpcDestinationResolver.createMatcherId('jira-issue-route'),
			pathPrefix: '/browse',
			precedence: 100,
			product: product.jira,
			routeFamily: routeFamily.jiraIssue,
		},
		{
			host: 'atlassian.net',
			hostMatch: 'suffix',
			id: XpcDestinationResolver.createMatcherId('jira-product-route'),
			pathPrefix: '/jira',
			precedence: 100,
			product: product.jira,
			routeFamily: routeFamily.jiraProduct,
		},
		{
			host: 'home.atlassian.com',
			id: XpcDestinationResolver.createMatcherId('atlassian-home-production'),
			precedence: 100,
			product: product.home,
			routeFamily: routeFamily.home,
		},
		{
			host: 'home.stg.atlassian.com',
			id: XpcDestinationResolver.createMatcherId('atlassian-home-staging'),
			precedence: 100,
			product: product.home,
			routeFamily: routeFamily.home,
		},
		{
			host: 'admin.atlassian.com',
			id: XpcDestinationResolver.createMatcherId('atlassian-admin-production'),
			precedence: 100,
			product: product.admin,
			routeFamily: routeFamily.admin,
		},
		{
			host: 'admin.stg.atlassian.com',
			id: XpcDestinationResolver.createMatcherId('atlassian-admin-staging'),
			precedence: 100,
			product: product.admin,
			routeFamily: routeFamily.admin,
		},
	],
	taxonomyVersion: 1,
});
