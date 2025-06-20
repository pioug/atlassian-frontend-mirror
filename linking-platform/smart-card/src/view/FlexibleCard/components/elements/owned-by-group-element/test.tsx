import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import OwnedByGroupElement from './index';

const testId = 'smart-element-avatar-group';

jest.mock('../../../../../state/flexible-ui-context', () => ({
	useFlexibleUiContext: jest.fn(() => ({
		ownedByGroup: [{ name: 'John Doe' }],
	})),
}));

const renderOwnedByElement = (onRender?: (hasData: boolean) => void) => {
	return render(
		<IntlProvider locale="en">
			<OwnedByGroupElement onRender={onRender} />
		</IntlProvider>,
	);
};

describe('OwnedByGroupElement', () => {
	ffTest.on('platform-linking-additional-flexible-element-props', '', () => {
		it('should render trigger onRender callback when feature flag is enabled', async () => {
			const onRender = jest.fn();

			renderOwnedByElement(onRender);

			const element = await screen.findByTestId(testId);
			expect(element).toBeTruthy();
			expect(onRender).toHaveBeenCalledWith(expect.any(Boolean));
		});
	});

	ffTest.off('platform-linking-additional-flexible-element-props', '', () => {
		it('should not trigger onRender callback when feature flag is disabled', async () => {
			const onRender = jest.fn();

			renderOwnedByElement(onRender);

			const element = await screen.findByTestId(testId);
			expect(element).toBeTruthy();
			expect(onRender).not.toHaveBeenCalled();
		});
	});
});
