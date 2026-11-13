import React from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';

import { Box } from '@atlaskit/primitives/compiled/box';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

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

function getOpenHosts(): HTMLElement[] {
	// eslint-disable-next-line testing-library/no-node-access -- hosts have no role
	return Array.from(document.querySelectorAll<HTMLElement>('[popover]')).filter((host) =>
		host.matches(':popover-open'),
	);
}

describe('FlagGroup host', () => {
	beforeEach(() => {
		jest.useFakeTimers();
		dismissLastFlag = null;
	});
	afterEach(() => {
		jest.useRealTimers();
	});

	describe('when top layer is on', () => {
		it('renders nothing while no flag shows', () => {
			passGate('platform-dst-top-layer');

			const { container } = render(<FlagsProvider>{null}</FlagsProvider>);

			expect(container).toBeEmptyDOMElement();
			expect(getHost()).toBeNull();
		});

		it('renders nothing for a flag group with no flags', () => {
			passGate('platform-dst-top-layer');

			const { container } = render(<FlagGroup>{[]}</FlagGroup>);

			expect(container).toBeEmptyDOMElement();
		});

		it('opens a manual popover host in place when a flag shows', async () => {
			passGate('platform-dst-top-layer');

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

			jest.useRealTimers();
			await expect(container).toBeAccessible();
		});

		it('does not move focus when a flag shows', () => {
			passGate('platform-dst-top-layer');

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
			passGate('platform-dst-top-layer');

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
			passGate('platform-dst-top-layer');

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
			passGate('platform-dst-top-layer');

			render(
				<FlagsProvider>
					<Consumer />
				</FlagsProvider>,
			);
			const trigger = screen.getByRole('button', { name: 'show' });
			fireEvent.click(trigger);
			fireEvent.click(trigger);
			expect(getOpenHosts()).toHaveLength(2);

			act(() => {
				dismissLastFlag?.();
			});

			// The exiting flag keeps its own host open.
			expect(getOpenHosts()).toHaveLength(2);

			act(() => {
				jest.runAllTimers();
			});

			expect(screen.getAllByTestId('flag')).toHaveLength(1);
			expect(getOpenHosts()).toHaveLength(1);
		});

		it('opens one host for each flag, with the group label and id on the newest one', () => {
			passGate('platform-dst-top-layer');

			render(
				<FlagGroup id="flag-group" label="Flags">
					<Flag id="b" icon={<Box />} title="Newest" testId="b" />
					<Flag id="a" icon={<Box />} title="Oldest" testId="a" />
				</FlagGroup>,
			);

			// eslint-disable-next-line testing-library/no-node-access -- hosts have no role
			const hosts = Array.from(document.querySelectorAll<HTMLElement>('[popover]'));
			expect(hosts).toHaveLength(2);
			expect(hosts[0]).toContainElement(screen.getByTestId('b'));
			expect(hosts[1]).toContainElement(screen.getByTestId('a'));
			expect(hosts.every((host) => host.matches(':popover-open'))).toBe(true);
			// eslint-disable-next-line testing-library/no-node-access -- the group container has no role
			expect(hosts[0]).toContainElement(document.getElementById('flag-group'));
			expect(screen.getAllByRole('heading', { name: 'Flags' })).toHaveLength(1);
		});

		it('moves the group label and id to the next host when the first flag exits', () => {
			passGate('platform-dst-top-layer');
			function Group({ flagIds }: { flagIds: string[] }) {
				return (
					<FlagGroup id="flag-group" label="Flags">
						{flagIds.map((flagId) => (
							<Flag key={flagId} id={flagId} icon={<Box />} title={flagId} testId={flagId} />
						))}
					</FlagGroup>
				);
			}
			const { rerender } = render(<Group flagIds={['b', 'a']} />);

			rerender(<Group flagIds={['a']} />);
			act(() => {
				jest.runAllTimers();
			});

			expect(screen.queryByTestId('b')).not.toBeInTheDocument();
			expect(getOpenHosts()).toHaveLength(1);
			// eslint-disable-next-line testing-library/no-node-access -- the group container has no role
			const group = document.getElementById('flag-group');
			expect(group).toContainElement(screen.getByTestId('a'));
			expect(screen.getAllByRole('heading', { name: 'Flags' })).toHaveLength(1);
		});

		it('animates in a flag that shows after the group mounts, but not a flag present at mount', () => {
			passGate('platform-dst-top-layer');
			passGate('platform-dst-motion-uplift');
			function Group({ flagIds }: { flagIds: string[] }) {
				return (
					<FlagGroup>
						{flagIds.map((flagId) => (
							<Flag key={flagId} id={flagId} icon={<Box />} title={flagId} testId={flagId} />
						))}
					</FlagGroup>
				);
			}
			function isEntering({ testId }: { testId: string }): boolean {
				// eslint-disable-next-line testing-library/no-node-access -- `Motion` sets the animation on its wrapper
				return Boolean(screen.getByTestId(testId).closest('[style*="animation"]'));
			}
			const { rerender } = render(<Group flagIds={['a']} />);
			expect(isEntering({ testId: 'a' })).toBe(false);

			rerender(<Group flagIds={['b', 'a']} />);

			expect(isEntering({ testId: 'b' })).toBe(true);
			expect(isEntering({ testId: 'a' })).toBe(false);
		});

		it('dismisses the first flag with Escape', () => {
			passGate('platform-dst-top-layer');
			passGate('platform_dst_flag_keyboard_dismiss');
			const onDismissed = jest.fn();
			render(
				<FlagGroup onDismissed={onDismissed}>
					<Flag id="b" icon={<Box />} title="Newest" testId="b" />
					<Flag id="a" icon={<Box />} title="Oldest" testId="a" />
				</FlagGroup>,
			);

			fireEvent.keyDown(document, { key: 'Escape' });
			act(() => {
				jest.runAllTimers();
			});

			expect(onDismissed).toHaveBeenCalledTimes(1);
			expect(onDismissed).toHaveBeenCalledWith('b', expect.anything());
		});

		it('opens the host for flags that are present when the group mounts', () => {
			passGate('platform-dst-top-layer');

			render(
				<FlagGroup>
					<Flag id="a" icon={<Box />} title="Flag" testId="a" />
				</FlagGroup>,
			);

			expect(getHost()?.matches(':popover-open')).toBe(true);
			expect(getHost()).toContainElement(screen.getByTestId('a'));
		});
	});

	describe('when top layer is off', () => {
		it('renders no popover host', () => {
			failGate('platform-dst-top-layer');

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
			failGate('platform-dst-top-layer');

			const { container } = render(<FlagGroup id="flag-group">{[]}</FlagGroup>);

			expect(container).toBeEmptyDOMElement();
			// eslint-disable-next-line testing-library/no-node-access -- the group container has no role
			expect(document.getElementById('flag-group')).toBeInTheDocument();
		});
	});
});
