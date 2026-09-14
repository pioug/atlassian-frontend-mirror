import { logException } from '@atlaskit/editor-common/monitoring';

const AGG_PATH = '/gateway/api/graphql';
const USERS_OPERATION_NAME = 'AvatarGroupUsersQuery';
const USERS_QUERY = `
	query ${USERS_OPERATION_NAME}($accountIds: [ID!]!) {
		users(accountIds: $accountIds) {
			accountId
			name
		}
	}
`;

type User = {
	accountId?: string;
	name?: string;
};

type UsersResponse = {
	data?: {
		users?: User[];
	};
};

export const fetchUserNames = async (accountIds: string[]): Promise<Record<string, string>> => {
	if (!accountIds.length) {
		return {};
	}

	try {
		const response = await fetch(AGG_PATH, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				operationName: USERS_OPERATION_NAME,
				query: USERS_QUERY,
				variables: { accountIds },
			}),
		});

		if (!response.ok) {
			throw new Error(`AGG user request failed: ${response.status}`);
		}

		const json: UsersResponse = await response.json();

		return (json.data?.users ?? []).reduce<Record<string, string>>((namesById, user) => {
			if (user.accountId && user.name) {
				namesById[user.accountId] = user.name;
			}

			return namesById;
		}, {});
	} catch (error) {
		logException(error as Error, {
			location: 'editor-plugin-avatar-group/fetchUserNames',
		});
		return {};
	}
};
