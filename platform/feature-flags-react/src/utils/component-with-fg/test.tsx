import React from 'react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { renderWithDi } from '@atlassian/testing-library/render-with-di';
import { screen } from '@atlassian/testing-library/screen';

import { componentWithFG } from './index';

describe('componentWithFG', () => {
	const trueText = 'True';
	const falseText = 'False';
	const TrueComponent = () => <>{trueText}</>;
	const FalseComponent = () => <>{falseText}</>;

	it('should return FalseComponent', () => {
		failGate('my_gate');

		const Component = componentWithFG('my_gate', TrueComponent, FalseComponent);

		renderWithDi(<Component />);

		expect(screen.getByText(falseText)).toBeVisible();
	});

	it('should return TrueComponent', () => {
		passGate('my_gate');

		const Component = componentWithFG('my_gate', TrueComponent, FalseComponent);

		renderWithDi(<Component />);

		expect(screen.getByText(trueText)).toBeVisible();
	});
});
