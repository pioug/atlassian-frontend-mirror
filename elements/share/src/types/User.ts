export type UserWithId = {
	id: string;
	type: 'user' | 'group' | 'team' | 'custom' | 'external_user';
};

export type UserWithEmail = {
	email: string;
	type: 'user' | 'external_user';
};

export type User = UserWithId | UserWithEmail;
