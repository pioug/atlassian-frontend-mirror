import React, { useState } from 'react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { act, render } from '@atlassian/testing-library/testing-library/react';

import ModalBody from '../../modal-body';
import ModalDialog from '../../modal-dialog';
import ModalTransition from '../../modal-transition';

jest.mock('raf-schd', () => (fn: () => void) => fn);
jest.mock('@atlaskit/ds-lib/warn-once');

function flushTasks() {
	return act(async () => {
		await new Promise((resolve) => setTimeout(resolve, 50));
	});
}

/**
 * A modal that draws a second modal inside it, with its own `ModalTransition`. Only the outer modal
 * closes: the inner `ModalTransition` never removes its modal.
 */
function renderNestedModals() {
	const innerOnClose = jest.fn();
	const innerOnCloseComplete = jest.fn();
	const closeOuterRef: { current: () => void } = { current: () => {} };
	function NestedModals() {
		const [isOuterOpen, setIsOuterOpen] = useState(true);
		closeOuterRef.current = () => setIsOuterOpen(false);
		return (
			<ModalTransition>
				{isOuterOpen && (
					<ModalDialog onClose={() => setIsOuterOpen(false)} testId="outer">
						<ModalBody>
							<ModalTransition>
								<ModalDialog
									onClose={innerOnClose}
									onCloseComplete={innerOnCloseComplete}
									testId="inner"
								>
									<ModalBody>
										<button type="button">Inner</button>
									</ModalBody>
								</ModalDialog>
							</ModalTransition>
						</ModalBody>
					</ModalDialog>
				)}
			</ModalTransition>
		);
	}
	render(<NestedModals />);
	return { innerOnClose, innerOnCloseComplete, closeOuter: () => closeOuterRef.current() };
}

describe('ModalDialog: closing a modal with a modal inside it', () => {
	it('closes the inner modal too, so its onCloseComplete runs once, with the top layer on', async () => {
		passGate('platform-dst-top-layer');
		const { innerOnClose, innerOnCloseComplete, closeOuter } = renderNestedModals();
		await flushTasks();

		act(() => closeOuter());
		await flushTasks();

		expect(innerOnCloseComplete).toHaveBeenCalledTimes(1);
		expect(innerOnClose).not.toHaveBeenCalled();
		expect(screen.queryByTestId('outer')).not.toBeInTheDocument();
	});

	it('unmounts the inner modal without closing it, so its onCloseComplete does not run, with the top layer off', async () => {
		failGate('platform-dst-top-layer');
		const { innerOnClose, innerOnCloseComplete, closeOuter } = renderNestedModals();
		await flushTasks();

		act(() => closeOuter());
		await flushTasks();

		expect(innerOnCloseComplete).not.toHaveBeenCalled();
		expect(innerOnClose).not.toHaveBeenCalled();
	});
});
