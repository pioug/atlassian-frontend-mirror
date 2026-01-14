import fetchMock from 'fetch-mock/cjs/client';

const mockPermissions = {
	allow: (): void => {
		fetchMock.post({
			matcher: (url: string) => url.includes('/gateway/api/permissions/bulk/permitted'),
			response: () => [
				{
					principalId: 'ari:cloud:identity::user/123-456-789',
					resourceId: 'ari:cloud:confluence::site/123-456-789',
					permissionId: 'manage',
					permitted: false,
					dontRequirePrincipalInSite: true,
				},
				{
					principalId: 'ari:cloud:identity::user/123-456-789',
					resourceId: 'ari:cloud:jira::site/123-456-789',
					permissionId: 'manage',
					permitted: false,
					dontRequirePrincipalInSite: true,
				},
				{
					principalId: 'ari:cloud:identity::user/123-456-789',
					resourceId: 'ari:cloud:jira-core::site/123-456-789',
					permissionId: 'manage',
					permitted: false,
					dontRequirePrincipalInSite: true,
				},
				{
					principalId: 'ari:cloud:identity::user/123-456-789',
					resourceId: 'ari:cloud:jira-software::site/123-456-789',
					permissionId: 'manage',
					permitted: false,
					dontRequirePrincipalInSite: true,
				},
				{
					principalId: 'ari:cloud:identity::user/123-456-789',
					resourceId: 'ari:cloud:jira-servicedesk::site/123-456-789',
					permissionId: 'manage',
					permitted: false,
					dontRequirePrincipalInSite: true,
				},
				{
					principalId: 'ari:cloud:identity::user/123-456-789',
					resourceId: 'ari:cloud:jira-product-discovery::site/123-456-789',
					permissionId: 'manage',
					permitted: false,
					dontRequirePrincipalInSite: true,
				},
				{
					principalId: 'ari:cloud:identity::user/123-456-789',
					resourceId: 'ari:cloud:loom::site/123-456-789',
					permissionId: 'manage',
					permitted: false,
					dontRequirePrincipalInSite: true,
				},
				{
					principalId: 'ari:cloud:identity::user/123-456-789',
					resourceId: 'ari:cloud:confluence::site/123-456-789',
					permissionId: 'write',
					permitted: true,
					dontRequirePrincipalInSite: true,
				},
				{
					principalId: 'ari:cloud:identity::user/123-456-789',
					resourceId: 'ari:cloud:jira::site/123-456-789',
					permissionId: 'write',
					permitted: true,
					dontRequirePrincipalInSite: true,
				},
				{
					principalId: 'ari:cloud:identity::user/123-456-789',
					resourceId: 'ari:cloud:jira-core::site/123-456-789',
					permissionId: 'write',
					permitted: true,
					dontRequirePrincipalInSite: true,
				},
				{
					principalId: 'ari:cloud:identity::user/123-456-789',
					resourceId: 'ari:cloud:jira-software::site/123-456-789',
					permissionId: 'write',
					permitted: true,
					dontRequirePrincipalInSite: true,
				},
				{
					principalId: 'ari:cloud:identity::user/123-456-789',
					resourceId: 'ari:cloud:jira-servicedesk::site/123-456-789',
					permissionId: 'write',
					permitted: true,
					dontRequirePrincipalInSite: true,
				},
				{
					principalId: 'ari:cloud:identity::user/123-456-789',
					resourceId: 'ari:cloud:jira-product-discovery::site/123-456-789',
					permissionId: 'write',
					permitted: true,
					dontRequirePrincipalInSite: true,
				},
				{
					principalId: 'ari:cloud:identity::user/123-456-789',
					resourceId: 'ari:cloud:loom::site/123-456-789',
					permissionId: 'write',
					permitted: true,
					dontRequirePrincipalInSite: true,
				},
			],
		});
	},
};

export { mockPermissions };
