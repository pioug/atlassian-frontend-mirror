import React, { useRef, useState } from 'react';
import { flushSync } from 'react-dom';

import { bind } from 'bind-event-listener';

import { Popover } from '@atlaskit/top-layer/popover/popover';

export default function TestingPopoverFocusHandoff(): React.ReactNode {
	const [openMenu, setOpenMenu] = useState<'first' | 'second' | null>(null);
	const [nestedRole, setNestedRole] = useState<'note' | 'dialog' | null>(null);
	const nestedPopoverRef = useRef<HTMLDivElement>(null);
	const parentDestinationRef = useRef<HTMLButtonElement>(null);
	const outsideDestinationRef = useRef<HTMLButtonElement>(null);

	function closeAndTransferFocus({ target }: { target: HTMLButtonElement | null }) {
		const popover = nestedPopoverRef.current;
		if (!popover || !target) {
			throw new Error('Expected the nested popover and focus destination');
		}

		// Capture focus before the component's non-capturing restoration listener runs.
		bind(popover, {
			type: 'toggle',
			listener: (event: ToggleEvent) => {
				if (event.newState === 'closed') {
					target.dataset.focusBeforeRestore = String(
						popover.ownerDocument.activeElement === target,
					);
				}
			},
			options: { capture: true, once: true },
		});

		// Commit the controlled close, then move focus before the queued toggle is dispatched.
		flushSync(() => setNestedRole(null));
		target.focus();
	}

	return (
		<>
			<button type="button" onClick={() => setOpenMenu('first')}>
				Open first menu
			</button>
			<Popover isOpen={openMenu === 'first'} mode="manual" role="dialog" label="First menu">
				<button
					type="button"
					data-testid="parent-destination"
					ref={parentDestinationRef}
					onClick={() => setOpenMenu('second')}
				>
					Open second menu
				</button>
				<button type="button" onClick={() => setOpenMenu(null)}>
					Close first menu
				</button>
				<button type="button" onClick={() => setNestedRole('note')}>
					Open nested note
				</button>
				<button type="button" onClick={() => setNestedRole('dialog')}>
					Open nested dialog
				</button>
				<Popover
					ref={nestedPopoverRef}
					isOpen={nestedRole !== null}
					mode="manual"
					role={nestedRole ?? 'note'}
					label="Nested popover"
					testId="nested-popover"
				>
					<button type="button" onClick={() => setNestedRole(null)}>
						Close nested popover
					</button>
					<button
						type="button"
						onClick={() => closeAndTransferFocus({ target: parentDestinationRef.current })}
					>
						Close and focus parent
					</button>
					<button
						type="button"
						onClick={() => closeAndTransferFocus({ target: outsideDestinationRef.current })}
					>
						Close and focus outside
					</button>
				</Popover>
			</Popover>
			<button
				type="button"
				data-testid="outside-destination"
				ref={outsideDestinationRef}
				onClick={() => setOpenMenu(null)}
			>
				Close from outside
			</button>
			<Popover
				isOpen={openMenu === 'second'}
				onClose={() => setOpenMenu(null)}
				role="dialog"
				label="Second menu"
			>
				<button type="button">Second menu action</button>
			</Popover>
		</>
	);
}
