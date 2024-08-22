import { type RovoAgent } from '../types';
import { createHeaders } from '../util/rovoAgentUtils';

export async function getAgentDetailsByAgentId(
	agentId: string,
	product: string,
	cloudId: string,
): Promise<RovoAgent> {
	const headers = createHeaders(product, cloudId);

	return await fetch(
		new Request(`/gateway/api/assist/agents/v1/${agentId}`, {
			method: 'GET',
			credentials: 'include',
			mode: 'cors',
			headers,
		}),
	).then((response) => response.json());
}

export async function getAgentDetailsByUserId(
	userId: string,
	product: string,
	cloudId: string,
): Promise<RovoAgent> {
	const headers = createHeaders(product, cloudId);

	return fetch(
		new Request(`/gateway/api/assist/agents/v1/accountid/${userId}`, {
			method: 'GET',
			credentials: 'include',
			mode: 'cors',
			headers,
		}),
	).then((response) => {
		return response.json();
	});
}
