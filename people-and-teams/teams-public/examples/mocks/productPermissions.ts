/**
 * Shape mirrors `MockFetchHandler` from the playground fetch enhancer, which does not
 * re-export the type.
 */
type MockFetchHandler = {
	match: (url: string, init?: RequestInit) => boolean;
	response: (url: string, init?: RequestInit) => Record<string, unknown>;
};

type RequestedPermission = { permissionId: string; resourceId: string };

export type ProductAccess = 'granted' | 'denied';

const readRequestBody = (init?: RequestInit): string =>
	typeof init?.body === 'string' ? init.body : '';

const isGraphqlPostFor = (url: string, init: RequestInit | undefined, operationName: string) =>
	url.includes('/gateway/api/graphql') &&
	init?.method?.toUpperCase() === 'POST' &&
	readRequestBody(init).includes(operationName);

/**
 * Mocks the product permission checks behind the Jira, Confluence and Loom add-container cards.
 *
 * 1. Answers `POST /gateway/api/permissions/bulk/permitted` with one result per requested
 *    permission, in the array shape that both product permission stores parse.
 * 2. Answers the `CanCreateProject` and `CanCreateConfluenceSpace` queries that the
 *    `migrate-product-permissions` gate adds.
 */
export const productPermissionHandlers = (access: ProductAccess): MockFetchHandler[] => {
	const permitted = access === 'granted';

	return [
		{
			match: (url) => url.includes('/gateway/api/permissions/bulk/permitted'),
			response: (_url, init) => {
				const requested: RequestedPermission[] = JSON.parse(readRequestBody(init) || '[]');
				return requested.map(({ permissionId, resourceId }) => ({
					permissionId,
					resourceId,
					permitted,
				})) as unknown as Record<string, unknown>;
			},
		},
		{
			match: (url, init) => isGraphqlPostFor(url, init, 'CanCreateProject'),
			response: () => ({ data: { jira: { canPerform: permitted } } }),
		},
		{
			match: (url, init) => isGraphqlPostFor(url, init, 'CanCreateConfluenceSpace'),
			response: () => ({
				data: { siteOperations: { application: permitted ? ['create_space'] : [] } },
			}),
		},
	];
};
