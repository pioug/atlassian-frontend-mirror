import { AnalyticsContext } from '@atlaskit/analytics-next';
import { render } from '@testing-library/react';
import React from 'react';
import createNamespaceContext from '../helper/createNamespaceContext';

jest.mock('@atlaskit/analytics-next', () => ({
	AnalyticsContext: jest.fn().mockImplementation((props) => <div>{props.children}</div>),
}));

type Props = React.PropsWithChildren<{
	data: string;
}>;

describe('createNamespaceContext', () => {
	test('calls AnalyticsContext with proper namespace for data', async () => {
		const Component = createNamespaceContext<Props>('testNamespace');

		render(
			<Component data={'test-data'}>
				<div />
			</Component>,
		);

		expect(AnalyticsContext).toHaveBeenCalledWith(
			expect.objectContaining({ data: { testNamespace: 'test-data' } }),
			expect.anything(),
		);

		await expect(document.body).toBeAccessible();
	});
});
