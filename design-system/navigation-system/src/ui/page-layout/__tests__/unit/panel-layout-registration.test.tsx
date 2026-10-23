import React, { StrictMode } from 'react';

import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import { Main } from '../../main/main';
import { PanelLayout } from '../../panel-layout';
import { Root } from '../../root';

beforeEach(() => {
	passGate('platform-dst-chat-panel-layout');
});

afterEach(() => {
	jest.restoreAllMocks();
});

it.each([false, true])('rejects a second host even when isPanelOpen is %s', (isPanelOpen) => {
	// React logs the expected effect error before propagating it to render().
	jest.spyOn(console, 'error').mockImplementation(() => {});
	expect(() =>
		render(
			<Root>
				<Main>
					<PanelLayout isPanelOpen={false} panel="First panel">
						First main
					</PanelLayout>
					<PanelLayout isPanelOpen={isPanelOpen} panel="Second panel">
						Second main
					</PanelLayout>
				</Main>
			</Root>,
		),
	).toThrow('Only one PanelLayout may be mounted per navigation Root/sizing coordinator');
});

it('allows updates, closing and replacement under the same Root in StrictMode', () => {
	function Host({ isOpen, width, id }: { isOpen: boolean; width: number; id: string }) {
		return (
			<StrictMode>
				<Root>
					<Main>
						<PanelLayout key={id} isPanelOpen={isOpen} panel={id} panelWidth={width}>
							Main content
						</PanelLayout>
					</Main>
				</Root>
			</StrictMode>
		);
	}
	const { rerender } = render(<Host isOpen width={400} id="First panel" />);
	rerender(<Host isOpen width={500} id="First panel" />);
	rerender(<Host isOpen={false} width={500} id="First panel" />);
	rerender(<Host isOpen width={500} id="First panel" />);
	expect(screen.getByRole('region', { name: 'Panel' })).toHaveTextContent('First panel');
	rerender(<Host isOpen width={450} id="Replacement panel" />);
	expect(screen.getByRole('region', { name: 'Panel' })).toHaveTextContent('Replacement panel');
});

it('allows independent Roots to each own a local panel', () => {
	render(
		<>
			{['First', 'Second'].map((name) => (
				<Root key={name}>
					<Main>
						<PanelLayout isPanelOpen panel={`${name} panel`} panelLabel={`${name} panel`}>
							{name} main
						</PanelLayout>
					</Main>
				</Root>
			))}
		</>,
	);
	expect(screen.getByRole('region', { name: 'First panel' })).toHaveTextContent('First panel');
	expect(screen.getByRole('region', { name: 'Second panel' })).toHaveTextContent('Second panel');
});
