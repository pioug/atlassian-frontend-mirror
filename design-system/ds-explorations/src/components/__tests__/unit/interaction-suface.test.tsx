import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { Box, Text } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { UNSAFE_InteractionSurface as InteractionSurface } from '../../../index';

// skipping this test as it does not work with jsdom.reconfigure. Need to rewrite this test.
// https://hello.jira.atlassian.cloud/browse/UTEST-2000
describe.skip('InteractionSurface component', () => {
	it('should render by itself', () => {
		render(
			<InteractionSurface testId="basic">
				<></>
			</InteractionSurface>,
		);
		expect(screen.getByTestId('basic')).toBeInTheDocument();
	});
	it('should render given a neutral hover interaction by default', () => {
		render(
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			<div style={{ position: 'relative' }}>
				<InteractionSurface testId="surface">hello</InteractionSurface>
			</div>,
		);

		const surfaceElement = screen.getByTestId('surface');
		expect(getComputedStyle(surfaceElement).backgroundColor).toBe('');
		fireEvent.mouseOver(surfaceElement);
		expect(surfaceElement).toHaveStyle(
			`background-color: ${token('color.background.neutral.bold.hovered')}`,
		);
	});

	it('should render given a brand hover interaction by if set as brand', () => {
		render(
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			<div style={{ position: 'relative' }}>
				<InteractionSurface appearance="brand.bold" testId="surface">
					hello
				</InteractionSurface>
			</div>,
		);

		const surfaceElement = screen.getByTestId('surface');
		expect(getComputedStyle(surfaceElement).backgroundColor).toBe('');
		fireEvent.mouseOver(surfaceElement);
		expect(surfaceElement).toHaveStyle(
			`background-color: ${token('color.background.brand.bold.hovered')}`,
		);
	});

	it('should render an inherited hover state if a Box context is present', () => {
		render(
			<Box backgroundColor="color.background.brand.bold">
				<InteractionSurface testId="surface">
					<Text>hello</Text>
				</InteractionSurface>
			</Box>,
		);

		const surfaceElement = screen.getByTestId('surface');
		expect(getComputedStyle(surfaceElement).backgroundColor).toBe('');
		fireEvent.mouseOver(surfaceElement);
		expect(surfaceElement).toHaveStyle(
			`background-color: ${token('color.background.brand.bold.hovered')}`,
		);
	});
});
