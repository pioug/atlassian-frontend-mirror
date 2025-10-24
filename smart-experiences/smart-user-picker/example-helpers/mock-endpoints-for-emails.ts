import { useEffect, useState } from 'react';
import fetchMock from 'fetch-mock/cjs/client';
import { EntityType, type RecommendationResponse, UserEntityType } from '../src/types';

const createUser = (id: string, name: string, email?: string) => ({
	entityType: EntityType.USER,
	id,
	name,
	avatarUrl: '',
	...(email && { email }),
	userType: UserEntityType.DEFAULT,
});

export const aliceOnly = [
	createUser('1', 'Alice Johnson (email visible)', 'alicejohnson@gmail.com'),
];

export const bothUsers = [
	createUser('1', 'Alice Johnson (email visible)', 'alicejohnson@gmail.com'),
	createUser('2', 'Bob Smith (email hidden)'),
];

const mockEndpoints = () => {
	// Unmatched routes will fallback to the network
	fetchMock.config.fallbackToNetwork = true;

	const createResponse = (users: any[]): RecommendationResponse => ({
		recommendedUsers: users,
		errors: [],
	});

	fetchMock.mock(
		(url: any, opts: any) =>
			/\/gateway\/api\/v1\/recommendations/.test(url) &&
			opts.method === 'POST' &&
			opts.body?.includes?.('"queryString":"alicejohnson@gmail.com"'),
		() =>
			new Promise((resolve) => {
				setTimeout(resolve, 250);
			}).then(() => createResponse(aliceOnly)),
	);
	fetchMock.mock(
		(url: any, opts: any) =>
			/\/gateway\/api\/v1\/recommendations/.test(url) && opts.method === 'POST',
		() =>
			new Promise((resolve) => {
				setTimeout(resolve, 250);
			}).then(() => createResponse(bothUsers)),
	);
};

export const useEndpointMocks = () => {
	const [ready, setReady] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			setReady(true);
		}, 250);
	}, []);

	useEffect(() => {
		mockEndpoints();
		return () => fetchMock.reset();
	}, []);

	return { ready };
};
