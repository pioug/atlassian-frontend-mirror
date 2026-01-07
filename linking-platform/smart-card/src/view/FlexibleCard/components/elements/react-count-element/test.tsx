import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import ReactCountElement from './index';

const testId = 'smart-element-badge';

jest.mock('../../../../../state/flexible-ui-context', () => ({
	useFlexibleUiContext: jest.fn(() => ({
		reactCount: 2,
	})),
	useFlexibleUiOptionContext: jest.fn(() => undefined),
}));

const renderOwnedByElement = (onRender?: (hasData: boolean) => void) => {
	return render(
		<IntlProvider locale="en">
			<ReactCountElement onRender={onRender} />
		</IntlProvider>,
	);
};

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('ReactCountElement', () => {
	it('should render trigger onRender callback when feature flag is enabled', async () => {
		const onRender = jest.fn();

		renderOwnedByElement(onRender);

		const element = await screen.findByTestId(testId);
		expect(element).toBeTruthy();
		expect(onRender).toHaveBeenCalledWith(expect.any(Boolean));
	});
});
