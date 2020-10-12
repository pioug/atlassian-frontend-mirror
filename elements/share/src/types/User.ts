export type UserWithId = {
  type: 'user' | 'group' | 'team';
  id: string;
};

export type UserWithEmail = {
  type: 'user';
  email: string;
};

export type User = UserWithId | UserWithEmail;
