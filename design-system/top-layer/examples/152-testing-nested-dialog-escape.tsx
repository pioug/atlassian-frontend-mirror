import React, { useCallback, useState } from 'react';

import { Dialog } from '@atlaskit/top-layer/dialog-content';

type TInnerState = { type: 'closed' } | { type: 'open'; isRefusing: boolean };

/**
 * A modal `Dialog` rendered inside another modal `Dialog`'s subtree. Each
 * `onClose` closes only its own dialog, so a test can detect exactly which
 * dialog responded to Escape. The counts show how often each dialog was asked.
 * `open-inner-refusing` opens an inner dialog that keeps itself open in `onClose`.
 */
export default function TestingNestedDialogEscape(): React.ReactNode {
	const [isOuterOpen, setIsOuterOpen] = useState(false);
	const [innerState, setInnerState] = useState<TInnerState>({ type: 'closed' });
	const [outerCloseCount, setOuterCloseCount] = useState(0);
	const [innerCloseCount, setInnerCloseCount] = useState(0);

	const closeOuter = useCallback(() => {
		setIsOuterOpen(false);
	}, []);

	const closeInner = useCallback(() => {
		setInnerState({ type: 'closed' });
	}, []);

	const handleOuterClose = useCallback(() => {
		setOuterCloseCount((count) => count + 1);
		setIsOuterOpen(false);
	}, []);

	const handleInnerClose = useCallback(() => {
		setInnerCloseCount((count) => count + 1);
		setInnerState((state) => {
			if (state.type === 'open' && state.isRefusing) {
				return state;
			}
			return { type: 'closed' };
		});
	}, []);

	return (
		<div>
			<button type="button" data-testid="open-outer" onClick={() => setIsOuterOpen(true)}>
				Open outer dialog
			</button>
			<div data-testid="outer-close-count">{outerCloseCount}</div>
			<div data-testid="inner-close-count">{innerCloseCount}</div>

			<Dialog
				onClose={handleOuterClose}
				isOpen={isOuterOpen}
				label="Outer dialog"
				testId="outer-dialog"
			>
				<div data-testid="outer-content">Outer dialog content</div>
				<button
					type="button"
					data-testid="open-inner"
					onClick={() => setInnerState({ type: 'open', isRefusing: false })}
				>
					Open inner dialog
				</button>
				<button
					type="button"
					data-testid="open-inner-refusing"
					onClick={() => setInnerState({ type: 'open', isRefusing: true })}
				>
					Open refusing inner dialog
				</button>
				<button type="button" data-testid="close-outer" onClick={closeOuter}>
					Close outer
				</button>

				<Dialog
					onClose={handleInnerClose}
					isOpen={innerState.type === 'open'}
					label="Inner dialog"
					testId="inner-dialog"
				>
					<div data-testid="inner-content">Inner dialog content</div>
					<button type="button" data-testid="close-inner" onClick={closeInner}>
						Close inner
					</button>
				</Dialog>
			</Dialog>
		</div>
	);
}
