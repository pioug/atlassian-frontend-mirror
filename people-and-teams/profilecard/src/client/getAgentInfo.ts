import { type RovoAgent } from '../types';

const createHeaders = (product: string): Headers => {
	const config = {
		headers: {
			'x-product': product,
			'x-experience-id': 'profile-card',
		},
	};

	return new Headers({
		...(config.headers || {}),
	});
};

export async function getAgentDetailsByAgentId(
	agentId: string,
	product: string,
): Promise<RovoAgent> {
	const headers = createHeaders(product);

	return await fetch(
		new Request(`assist/agents/v1/${agentId}`, {
			method: 'GET',
			credentials: 'include',
			mode: 'cors',
			headers,
		}),
	).then((response) => response.json());
}

export async function getAgentDetailsByUserId(userId: string, product: string): Promise<RovoAgent> {
	const headers = createHeaders(product);

	return await fetch(
		new Request(`assist/agents/v1/accountid/${userId}`, {
			method: 'GET',
			credentials: 'include',
			mode: 'cors',
			headers,
		}),
	).then((response) => response.json());
}
