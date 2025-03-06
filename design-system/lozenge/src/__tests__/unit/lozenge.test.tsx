import React from 'react';

import { render, screen } from '@testing-library/react';

import EmotionLozenge from '@atlaskit/lozenge';
import CompiledLozenge from '@atlaskit/lozenge/compiled';
import { ffTest } from '@atlassian/feature-flags-test-utils';

describe('Lozenge', () => {
	describe.each([
		['@atlaskit/lozenge', EmotionLozenge],
		['@atlaskit/lozenge/compiled', CompiledLozenge],
	])('entrypoint=%p', (_entrypoint, Component) => {
		it('renders', () => {
			render(<Component testId="test">Hello</Component>);

			const lozenge = screen.getByTestId('test');
			expect(lozenge).toBeInTheDocument();
			expect(lozenge).toHaveCompiledCss({
				// Just a subset of styles because visual refresh vs. non-visual refresh are different
				display: 'inline-flex',
				blockSize: 'min-content',
				position: 'static',
			});
		});
	});

	ffTest.off('platform_dst_lozenge_fg', 'when gate fails', () => {
		it('@atlaskit/lozenge should be Emotion', () => {
			render(<EmotionLozenge testId="test">Hello</EmotionLozenge>);

			const lozenge = screen.getByTestId('test');
			expect(lozenge).toBeInTheDocument();

			// These have Emotion classes, not Compiled
			expect(lozenge).not.toHaveAttribute('class', expect.stringMatching(/(_[a-z0-9]{8}\s?)+/));
			expect(lozenge).toHaveAttribute('class', expect.stringMatching(/^css-[a-z0-9]{7}$/));
		});
	});

	ffTest.on('platform_dst_lozenge_fg', 'when gate passes', () => {
		it('@atlaskit/lozenge should have Compiled styles', () => {
			render(<EmotionLozenge testId="test">Hello</EmotionLozenge>);

			const lozenge = screen.getByTestId('test');
			expect(lozenge).toBeInTheDocument();

			// These have Compiled classes, not Emotion
			expect(lozenge).not.toHaveAttribute('class', expect.stringMatching(/^css-[a-z0-9]{7}$/));
			expect(lozenge).toHaveAttribute('class', expect.stringMatching(/^(_[a-z0-9]{8}\s?)+$/));
		});
	});
});
