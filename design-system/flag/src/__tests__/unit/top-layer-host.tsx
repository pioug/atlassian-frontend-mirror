import React from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';

import { Box } from '@atlaskit/primitives/compiled/box';
import { ffTest } from '@atlassian/feature-flags-test-utils/test-runner';

import Flag from '../../flag';
import FlagGroup from '../../flag-group';
import { type DismissFn } from '../../flag-provider';
import { FlagsProvider } from '../../flags-provider';
import { useFlags } from '../../use-flags';

let dismissLastFlag: DismissFn | null = null;

const Consumer = () => {
	const { showFlag } = useFlags();
	return (
		<button
			type="button"
			onClick={() => {
				dismissLastFlag = showFlag({ title: 'Saved', icon: <Box />, testId: 'flag' });
			}}
		>
			show
		</button>
	);
};

function getHost(): HTMLElement | null {
	return document.querySelector<HTMLElement>('[popover]');
}

describe('FlagGroup host', () => {
	beforeEach(() => {
		jest.useFakeTimers();
		dismissLastFlag = null;
	});
	afterEach(() => {
		jest.useRealTimers();
	});

	ffTest.on('platform-dst-top-layer', 'when top layer is on', () => {
		it('renders nothing while no flag shows', () => {
			const { container } = render(<FlagsProvider>{null}</FlagsProvider>);

			expect(container).toBeEmptyDOMElement();
			expect(getHost()).toBeNull();
		});

		it('renders nothing for a flag group with no flags', () => {
			const { container } = render(<FlagGroup>{[]}</FlagGroup>);

			expect(container).toBeEmptyDOMElement();
		});

		it('opens a manual popover host in place when a flag shows', () => {
			const { container } = render(
				<FlagsProvider>
					<Consumer />
				</FlagsProvider>,
			);

			fireEvent.click(screen.getByRole('button', { name: 'show' }));

			const host = getHost();
			expect(host).not.toBeNull();
			expect(host).toHaveAttribute('popover', 'manual');
			expect(host?.matches(':popover-open')).toBe(true);
			expect(container).toContainElement(host);
			expect(host).toContainElement(screen.getByRole('alert'));
		});

		it('does not move focus when a flag shows', () => {
			render(
				<FlagsProvider>
					<Consumer />
				</FlagsProvider>,
			);
			const trigger = screen.getByRole('button', { name: 'show' });
			trigger.focus();

			fireEvent.click(trigger);

			expect(screen.getByRole('alert')).toBeInTheDocument();
			expect(trigger).toHaveFocus();
		});

		it('keeps the host open while the last flag exits, then removes it', () => {
			const { container } = render(
				<FlagsProvider>
					<Consumer />
				</FlagsProvider>,
			);
			fireEvent.click(screen.getByRole('button', { name: 'show' }));
			act(() => {
				jest.runAllTimers();
			});

			act(() => {
				dismissLastFlag?.();
			});

			// The flag plays its exit animation inside the open host.
			expect(getHost()?.matches(':popover-open')).toBe(true);
			expect(screen.getByTestId('flag')).toBeInTheDocument();

			act(() => {
				jest.runAllTimers();
			});

			expect(screen.queryByTestId('flag')).not.toBeInTheDocument();
			expect(getHost()).toBeNull();
			// Only the consumer's button is left.
			// eslint-disable-next-line testing-library/no-node-access -- checking that no host is left in the container
			expect(container.children).toHaveLength(1);
		});

		it('opens the host again for a flag that shows after the host was removed', () => {
			render(
				<FlagsProvider>
					<Consumer />
				</FlagsProvider>,
			);
			const trigger = screen.getByRole('button', { name: 'show' });

			fireEvent.click(trigger);
			act(() => {
				dismissLastFlag?.();
			});
			act(() => {
				jest.runAllTimers();
			});
			expect(getHost()).toBeNull();

			fireEvent.click(trigger);

			expect(getHost()?.matches(':popover-open')).toBe(true);
			expect(screen.getByRole('alert')).toBeInTheDocument();
		});

		it('keeps the host open while one of several flags exits', () => {
			render(
				<FlagsProvider>
					<Consumer />
				</FlagsProvider>,
			);
			const trigger = screen.getByRole('button', { name: 'show' });
			fireEvent.click(trigger);
			fireEvent.click(trigger);

			act(() => {
				dismissLastFlag?.();
			});
			act(() => {
				jest.runAllTimers();
			});

			expect(screen.getAllByTestId('flag')).toHaveLength(1);
			expect(getHost()?.matches(':popover-open')).toBe(true);
		});

		it('opens the host for flags that are present when the group mounts', () => {
			render(
				<FlagGroup>
					<Flag id="a" icon={<Box />} title="Flag" testId="a" />
				</FlagGroup>,
			);

			expect(getHost()?.matches(':popover-open')).toBe(true);
			expect(getHost()).toContainElement(screen.getByTestId('a'));
		});
	});

	ffTest.off('platform-dst-top-layer', 'when top layer is off', () => {
		it('renders no popover host', () => {
			render(
				<FlagsProvider>
					<Consumer />
				</FlagsProvider>,
			);

			fireEvent.click(screen.getByRole('button', { name: 'show' }));

			expect(screen.getByRole('alert')).toBeInTheDocument();
			expect(getHost()).toBeNull();
		});

		it('keeps rendering the group container to a portal while no flag shows', () => {
			const { container } = render(<FlagGroup id="flag-group">{[]}</FlagGroup>);

			expect(container).toBeEmptyDOMElement();
			// eslint-disable-next-line testing-library/no-node-access -- the group container has no role
			expect(document.getElementById('flag-group')).toBeInTheDocument();
		});
	});
});
