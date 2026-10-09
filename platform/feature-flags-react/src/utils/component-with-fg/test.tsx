import React from 'react';

import { ffTest } from '@atlassian/feature-flags-test-utils/test-runner';
import { renderWithDi } from '@atlassian/testing-library/render-with-di';
import { screen } from '@atlassian/testing-library/screen';

import { componentWithFG } from './index';

describe('componentWithFG', () => {
	const trueText = 'True';
	const falseText = 'False';
	const TrueComponent = () => <>{trueText}</>;
	const FalseComponent = () => <>{falseText}</>;

	ffTest.off('my_gate', 'when gate fails', () => {
		it('should return FalseComponent', () => {
			const Component = componentWithFG('my_gate', TrueComponent, FalseComponent);

			renderWithDi(<Component />);

			expect(screen.getByText(falseText)).toBeVisible();
		});
	});

	ffTest.on('my_gate', 'when gate passes', () => {
		it('should return TrueComponent', () => {
			const Component = componentWithFG('my_gate', TrueComponent, FalseComponent);

			renderWithDi(<Component />);

			expect(screen.getByText(trueText)).toBeVisible();
		});
	});
});
