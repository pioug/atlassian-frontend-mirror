import React from 'react';

import { IntlProvider } from 'react-intl';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { render, screen } from '@atlassian/testing-library';

import CommentCountElement from './index';

const testId = 'smart-element-badge';

jest.mock('../../../../../state/flexible-ui-context', () => ({
	useFlexibleUiContext: jest.fn(() => ({
		commentCount: 2,
	})),
	useFlexibleUiOptionContext: jest.fn(() => undefined),
}));

const renderOwnedByElement = (onRender?: (hasData: boolean) => void) => {
	return render(
		<SmartCardProvider>
			<IntlProvider locale="en">
				<CommentCountElement onRender={onRender} />
			</IntlProvider>
		</SmartCardProvider>,
	);
};

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('CommentCountElement', () => {
	it('should render trigger onRender callback when feature flag is enabled', async () => {
		const onRender = jest.fn();

		renderOwnedByElement(onRender);

		const element = await screen.findByTestId(testId);
		expect(element).toBeTruthy();
		expect(onRender).toHaveBeenCalledWith(expect.any(Boolean));
	});
});
