import type { GetStatusTransitionsInvokeResponse } from '@atlaskit/linking-types/smart-link-actions';

import extractLozengeActionItems from '../extract-lozenge-action-items';

describe('extractLozengeActionItems', () => {
	it('extracts action response to lozenge action items', () => {
		const response = {
			transitions: [
				{ id: '1', name: 'Done', appearance: 'success' },
				{ id: '2', name: 'In Progress', appearance: 'inprogress' },
			],
		};

		const items = extractLozengeActionItems(response);

		expect(items).toEqual([
			{ id: '2', text: 'In Progress', appearance: 'inprogress' },
			{ id: '1', text: 'Done', appearance: 'success' },
		]);
	});

	it('returns an empty array if there is no transition items', () => {
		const items = extractLozengeActionItems({} as GetStatusTransitionsInvokeResponse);

		expect(items).toEqual([]);
	});

	it('defaults lozenge appearance to default', () => {
		const response = {
			transitions: [{ id: '1', name: 'Random' }],
		};

		const items = extractLozengeActionItems(response);

		expect(items).toEqual([{ id: '1', text: 'Random', appearance: 'default' }]);
	});

	it('sorts transitions by appearance then status', () => {
		const response = {
			transitions: [
				{ id: '1', name: 'In Progress', appearance: 'inprogress' },
				{ id: '2', name: 'Done', appearance: 'success' },
				{ id: '3', name: 'To Do', appearance: 'default' },
				{ id: '4', name: 'Explore', appearance: 'default' },
				{ id: '5', name: 'In Review', appearance: 'inprogress' },
			],
		};

		const items = extractLozengeActionItems(response);

		expect(items).toEqual([
			{ id: '4', text: 'Explore', appearance: 'default' },
			{ id: '3', text: 'To Do', appearance: 'default' },
			{ id: '1', text: 'In Progress', appearance: 'inprogress' },
			{ id: '5', text: 'In Review', appearance: 'inprogress' },
			{ id: '2', text: 'Done', appearance: 'success' },
		]);
	});
});
