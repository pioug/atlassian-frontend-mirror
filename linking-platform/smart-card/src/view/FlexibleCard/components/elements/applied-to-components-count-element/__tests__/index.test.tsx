import React from 'react';

import { render, screen } from '@testing-library/react';

import context from '../../../../../../__fixtures__/flexible-ui-data-context';
import { getFlexibleCardTestWrapper } from '../../../../../../__tests__/__utils__/unit-testing-library-helpers';
import AppliedToComponentsCount from '../index';

const testId = 'smart-element-applied-to-components-count';

describe('Element: AppliedToComponentsCount', () => {
	it('renders nothing if context is null', async () => {
		render(<AppliedToComponentsCount testId={testId} />, {
			wrapper: getFlexibleCardTestWrapper(),
		});

		const element = screen.queryByTestId(testId);
		expect(element).toBeNull();
	});

	it('renders nothing if appliedToComponentsCount is not present in context', () => {
		const { appliedToComponentsCount: _, ...contextWithoutAppliedToComponentsCount } = context;
		render(<AppliedToComponentsCount testId={testId} />, {
			wrapper: getFlexibleCardTestWrapper(contextWithoutAppliedToComponentsCount),
		});

		const element = screen.queryByTestId(testId);
		expect(element).toBeNull();
	});

	it('renders element', () => {
		render(<AppliedToComponentsCount testId={testId} />, {
			wrapper: getFlexibleCardTestWrapper(context),
		});

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
			render(<AppliedToComponentsCount testId={testId} />, {
				wrapper: getFlexibleCardTestWrapper(newContext),
			});

			const element = await screen.findByTestId(testId);
			expect(element).toBeVisible();

			const message = screen.getByText(expectedMessage);
			expect(message).toBeVisible();
		},
	);

	it('should capture and report a11y violations', async () => {
		const { container } = render(<AppliedToComponentsCount testId={testId} />, {
			wrapper: getFlexibleCardTestWrapper(),
		});
		await expect(container).toBeAccessible();
	});
});
