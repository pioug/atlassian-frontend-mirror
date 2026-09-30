import React from 'react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import { Main } from '../../main/main';
import { Root } from '../../root';
import { useLayoutAreaSizing } from '../../use-layout-area-sizing';

function SizingProbe() {
	const { state } = useLayoutAreaSizing({
		area: 'panel',
		config: { defaultWidth: 400, minWidth: 320, isOpen: true },
	});
	return <span data-testid="sizing-state">{state ? 'managed' : 'unmanaged'}</span>;
}

it.each([false, true])(
	'preserves the legacy grid and skips allocation with the gate off (motion: %s)',
	(motion) => {
		failGate('platform-dst-chat-panel-layout');
		(motion ? passGate : failGate)('platform-dst-motion-uplift-panel');
		render(
			<Root testId="root">
				<Main>
					<SizingProbe />
				</Main>
			</Root>,
		);
		expect(screen.getByTestId('sizing-state')).toHaveTextContent('unmanaged');
		expect(screen.getByTestId('root')).toHaveCompiledCss(
			'grid-template-columns',
			'auto auto minmax(0,1fr) auto',
			{ media: '(min-width: 64rem)' },
		);
		expect(screen.getByTestId('root')).toHaveCompiledCss(
			'grid-template-columns',
			'auto auto minmax(0,1fr) auto auto',
			{ media: '(min-width: 90rem)' },
		);
		expect(screen.getByTestId('root')).not.toHaveTextContent('--n_mainMinW');
	},
);

it.each([false, true])(
	'enables shared sizing and the chat grid only with the gate on (motion: %s)',
	(motion) => {
		passGate('platform-dst-chat-panel-layout');
		(motion ? passGate : failGate)('platform-dst-motion-uplift-panel');
		render(
			<Root testId="root">
				<Main>
					<SizingProbe />
				</Main>
			</Root>,
		);
		expect(screen.getByTestId('sizing-state')).toHaveTextContent(/^managed$/);
		expect(screen.getByTestId('root')).toHaveCompiledCss(
			'grid-template-columns',
			'minmax(var(--n_mainMinW),1fr) minmax(0,max-content)',
			{ media: '(min-width: 40rem)' },
		);
		expect(screen.getByTestId('root')).toHaveTextContent('--n_mainMinW: 320px');
	},
);
