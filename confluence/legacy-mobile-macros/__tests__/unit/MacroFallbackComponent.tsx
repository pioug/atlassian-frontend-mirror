import React from 'react';

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { MacroFallbackComponent } from '../../src/ui';

import { getMockMacroComponentProps } from './props.mock';

describe('MacroComponent', () => {
	it('should show spinner while loading', () => {
		const props = getMockMacroComponentProps();

		const { getByTestId, container } = render(
			<IntlProvider locale="en">
				<MacroFallbackComponent {...props} />
			</IntlProvider>,
		);

		const cardButton = container.querySelector('button');
		expect(cardButton).toBeTruthy();
		expect(cardButton && cardButton.disabled).toBeFalsy();

		cardButton && cardButton.click();

		const cardSpinner = getByTestId('macro-card-spinner');
		expect(cardSpinner && cardSpinner).toBeTruthy();
	});
});
