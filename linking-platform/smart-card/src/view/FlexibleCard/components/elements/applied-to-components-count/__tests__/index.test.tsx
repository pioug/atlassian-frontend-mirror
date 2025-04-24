import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import context from '../../../../../../__fixtures__/flexible-ui-data-context';
import { FlexibleUiContext } from '../../../../../../state/flexible-ui-context';
import { FlexibleUiDataContext } from '../../../../../../state/flexible-ui-context/types';
import AppliedToComponentsCount from '../index';

const testId = 'smart-element-applied-to-components-count';

const testComponent = (context?: FlexibleUiDataContext) => {
	return (
		<IntlProvider locale="en">
			<FlexibleUiContext.Provider value={context}>
				<AppliedToComponentsCount testId={testId} />
			</FlexibleUiContext.Provider>
		</IntlProvider>
	);
};

describe('Element: AppliedToComponentsCount', () => {
	it('renders nothing if context is null', async () => {
		render(testComponent());

		const element = screen.queryByTestId(testId);
		expect(element).toBeNull();
	});

	it('renders nothing if appliedToComponentsCount is not present in context', () => {
		const { appliedToComponentsCount: _, ...contextWithoutAppliedToComponentsCount } = context;
		render(testComponent(contextWithoutAppliedToComponentsCount));

		const element = screen.queryByTestId(testId);
		expect(element).toBeNull();
	});

	it('renders element', () => {
		render(testComponent(context));

		const element = screen.getByTestId(testId);
		expect(element).toBeVisible();
	});

	it.each<[number, string]>([
		[0, 'Applied to 0 components'],
		[1, 'Applied to 1 component'],
		[2, 'Applied to 2 components'],
		[999, 'Applied to 999 components'],
	])(
		'renders correct message when applied to %s components',
		async (componentCount: number, expectedMessage: string) => {
			const newContext = { ...context, appliedToComponentsCount: componentCount };
			render(testComponent(newContext));

			const element = await screen.findByTestId(testId);
			expect(element).toBeVisible();

			const message = screen.getByText(expectedMessage);
			expect(message).toBeVisible();
		},
	);
});
