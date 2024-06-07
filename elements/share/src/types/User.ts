export type UserWithId = {
	type: 'user' | 'group' | 'team' | 'custom' | 'external_user';
	id: string;
};

export type UserWithEmail = {
	type: 'user' | 'external_user';
	email: string;
};

export type User = UserWithId | UserWithEmail;
