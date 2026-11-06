import React, { type ReactNode, StrictMode, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

import { Popover } from '@atlaskit/top-layer/popover/popover';

// Moves focus inside in a passive effect, as content such as a calendar does when it opens.
function TakesFocusOnMount({ name }: { name: string }) {
	const buttonRef = useRef<HTMLButtonElement>(null);
	useEffect(() => {
		buttonRef.current?.focus();
	}, []);
	return (
		<button type="button" ref={buttonRef} data-testid={`${name}-inside`}>
			Inside
		</button>
	);
}

/**
 * The popover mounts already open on the first open, so StrictMode shows it a second time after
 * the content effect moved focus inside.
 */
function ContentTakesFocus({ name }: { name: string }) {
	const [isMounted, setIsMounted] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div>
			<button
				type="button"
				data-testid={`${name}-trigger`}
				onClick={() => {
					setIsMounted(true);
					setIsOpen(true);
				}}
			>
				Open ({name})
			</button>
			{isMounted ? (
				<Popover mode="manual" isOpen={isOpen} testId={`${name}-popover`}>
					<TakesFocusOnMount name={name} />
					<button type="button" data-testid={`${name}-close`} onClick={() => setIsOpen(false)}>
						Close
					</button>
				</Popover>
			) : null}
		</div>
	);
}

/**
 * "Close and reopen" closes the popover, then reopens it before the close finishes, while focus
 * is still inside.
 */
function ReopenDuringClose() {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div>
			<button type="button" data-testid="reopen-trigger" onClick={() => setIsOpen(true)}>
				Open (reopen case)
			</button>
			<Popover mode="manual" isOpen={isOpen} testId="reopen-popover">
				<button
					type="button"
					data-testid="reopen-close-and-reopen"
					onClick={() => {
						// Commit the close, so the popover hides, then reopen it in the same task.
						flushSync(() => setIsOpen(false));
						setIsOpen(true);
					}}
				>
					Close and reopen
				</button>
				<button type="button" data-testid="reopen-close" onClick={() => setIsOpen(false)}>
					Close
				</button>
			</Popover>
		</div>
	);
}

/**
 * Test fixture: the element that a manual `Popover` returns focus to is never inside the popover.
 */
export default function TestingManualFocusRestoreTarget(): ReactNode {
	return (
		<div>
			<StrictMode>
				<ContentTakesFocus name="strict" />
			</StrictMode>
			<ContentTakesFocus name="plain" />
			<ReopenDuringClose />
		</div>
	);
}
