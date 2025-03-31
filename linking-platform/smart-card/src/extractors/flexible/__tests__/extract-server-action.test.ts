import type { JsonLd } from '@atlaskit/json-ld-types';

import { TEST_BASE_DATA } from '../../common/__mocks__/jsonld';
import extractServerAction from '../extract-server-action';

describe('extractServerAction', () => {
	const updateAction = {
		'@type': 'UpdateAction',
		name: 'UpdateActionName',
	} as JsonLd.Primitives.UpdateAction;

	const createAction = {
		'@type': 'CreateAction',
		name: 'CreateActionName',
	} as JsonLd.Primitives.CreateAction;

	it('returns empty array when there is no data', () => {
		const action = extractServerAction();

		expect(action).toEqual([]);
	});

	it('returns empty array when there is no server action', () => {
		const action = extractServerAction(TEST_BASE_DATA);

		expect(action).toEqual([]);
	});

	it('returns server actions when type is object', () => {
		const action = extractServerAction({
			...TEST_BASE_DATA,
			'atlassian:serverAction': updateAction,
		});

		expect(action).toEqual([updateAction]);
	});

	it('returns server actions when type is array', () => {
		const action = extractServerAction({
			...TEST_BASE_DATA,
			'atlassian:serverAction': [updateAction, createAction],
		});

		expect(action).toEqual([updateAction, createAction]);
	});
});
