import React from 'react';

import { render, screen } from '@testing-library/react';

import LozengeCompiled from '../../compiled';
import LozengeEmotion from '../../index';

describe.each([
	['emotion', LozengeEmotion],
	['compiled', LozengeCompiled],
])('variant=%p', (_variant, Component) => {
	it('renders', () => {
		render(<Component testId="test">Hello</Component>);

		expect(screen.getByTestId('test')).toBeInTheDocument();
	});
});
