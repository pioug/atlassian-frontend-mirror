import { action } from '@storybook/addon-actions';

import { type HydratedUser, type HydratedValues } from '../src';

import { mockAvatarUrl, users } from './data';

export const onHydrate = (query: string): Promise<HydratedValues> => {
	action('onHydrate')(query);

	return new Promise((resolve) => {
		setTimeout(() => {
			const hydratedUsers = users
				.filter((user) => query.includes(user.value))
				.map(
					(user): HydratedUser => ({
						type: 'user',
						id: user.value,
						name: user.displayName,
						avatarUrl: mockAvatarUrl,
					}),
				);

			resolve({
				assignee: hydratedUsers,
				reporter: hydratedUsers,
			});
		}, 300);
	});
};
