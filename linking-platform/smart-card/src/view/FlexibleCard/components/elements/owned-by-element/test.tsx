import React from 'react';

import { IntlProvider } from 'react-intl';

import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';

import OwnedByElement from './index';

const testId = 'smart-element-text';

jest.mock('../../../../../state/flexible-ui-context/useFlexibleUiContext', () => ({
	useFlexibleUiContext: jest.fn(() => ({
		ownedBy: 'John Doe',
	})),
}));

const renderOwnedByElement = (onRender?: (hasData: boolean) => void) => {
	return render(
		<IntlProvider locale="en">
			<OwnedByElement onRender={onRender} />
		</IntlProvider>,
	);
};

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('OwnedByElement', () => {
	it('should render trigger onRender callback when feature flag is enabled', async () => {
		const onRender = jest.fn();

		renderOwnedByElement(onRender);

		const element = await screen.findByTestId(testId);
		expect(element).toBeTruthy();
		expect(onRender).toHaveBeenCalledWith(expect.any(Boolean));
	});
});
