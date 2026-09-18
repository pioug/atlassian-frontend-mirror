import { screen } from '@testing-library/react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { useDatasourceCrossProductAttribution } from '../../../../analytics/xpc/useDatasourceCrossProductAttribution';
import { setup } from './_utils';

jest.mock('../../../../analytics/xpc/useDatasourceCrossProductAttribution', () => ({
	useDatasourceCrossProductAttribution: jest.fn(),
}));

const mockUseDatasourceCrossProductAttribution =
	useDatasourceCrossProductAttribution as jest.MockedFunction<
		typeof useDatasourceCrossProductAttribution
	>;

describe('XPC MAU: JiraIssuesConfigModal', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('wraps the JQL issue-count URL via the cross-product attribution hook when the gate is on', async () => {
		passGate('electric_issue_like_table_xpc_url_wrapping');
		const wrapCrossProductUrl = jest.fn((url: string) => `${url}&xpis=wrapped`);
		mockUseDatasourceCrossProductAttribution.mockReturnValue({
			wrapCrossProductUrl,
		});

		await setup();

		expect(wrapCrossProductUrl).toHaveBeenCalledWith(expect.stringContaining('/issues/?jql='));

		const issueCountLink = screen.getByTestId('item-count-url');
		expect(issueCountLink).toHaveAttribute('href', expect.stringContaining('&xpis=wrapped'));
	});

	it('renders the raw URL and never wraps it when the gate is off (master parity)', async () => {
		failGate('electric_issue_like_table_xpc_url_wrapping');
		const wrapCrossProductUrl = jest.fn((url: string) => `${url}&xpis=wrapped`);
		mockUseDatasourceCrossProductAttribution.mockReturnValue({
			wrapCrossProductUrl,
		});

		await setup();

		expect(wrapCrossProductUrl).not.toHaveBeenCalled();

		const issueCountLink = screen.getByTestId('item-count-url');
		expect(issueCountLink).toHaveAttribute(
			'href',
			'https://hello.atlassian.net/issues/?jql=some-query',
		);
	});
});
