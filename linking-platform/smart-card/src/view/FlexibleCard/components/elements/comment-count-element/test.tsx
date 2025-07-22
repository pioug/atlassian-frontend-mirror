import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import CommentCountElement from './index';

const testId = 'smart-element-badge';

jest.mock('../../../../../state/flexible-ui-context', () => ({
	useFlexibleUiContext: jest.fn(() => ({
		commentCount: 2,
	})),
}));

const renderOwnedByElement = (onRender?: (hasData: boolean) => void) => {
	return render(
		<IntlProvider locale="en">
			<CommentCountElement onRender={onRender} />
		</IntlProvider>,
	);
};

describe('CommentCountElement', () => {
	it('should render trigger onRender callback when feature flag is enabled', async () => {
		const onRender = jest.fn();

		renderOwnedByElement(onRender);

		const element = await screen.findByTestId(testId);
		expect(element).toBeTruthy();
		expect(onRender).toHaveBeenCalledWith(expect.any(Boolean));
	});
});
