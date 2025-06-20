import React from 'react';

import { render, screen } from '@testing-library/react';

import { ThemedButton, ThemedIconButton, ThemedLinkIconButton } from '../../button';

describe('ThemedButton', () => {
	it('should not pass through styles', () => {
		render(
			<ThemedButton
				// @ts-expect-error
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				style={{ color: 'red' }}
			>
				Hello World
			</ThemedButton>,
		);

		const button = screen.getByRole('button', { name: 'Hello World' });
		expect(button).not.toHaveStyle({ color: 'red' });
	});
});

describe('ThemedIconButton', () => {
	it('should not pass through styles', () => {
		render(
			<ThemedIconButton
				label="Hello World"
				icon={() => null}
				// @ts-expect-error
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				style={{ color: 'red' }}
			/>,
		);

		const button = screen.getByRole('button', { name: 'Hello World' });
		expect(button).not.toHaveStyle({ color: 'red' });
	});
});

describe('ThemedLinkIconButton', () => {
	it('should not pass through styles', () => {
		render(
			<ThemedLinkIconButton
				label="Hello World"
				icon={() => null}
				href="https://www.atlassian.com/"
				// @ts-expect-error
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				style={{ color: 'red' }}
			/>,
		);

		const button = screen.getByRole('link', { name: 'Hello World' });
		expect(button).not.toHaveStyle({ color: 'red' });
	});
});
