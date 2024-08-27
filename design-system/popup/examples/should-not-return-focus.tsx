/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useEffect, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import mergeRefs from '@atlaskit/ds-lib/merge-refs';

import Popup from '../src';

const TestInput = ({ onCancel }: { onCancel: () => void }) => {
	const ref = useRef<HTMLInputElement>(null);

	useEffect(() => {
		ref.current?.focus();
	}, []);

	const onKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
			if (event.key === 'Escape') {
				onCancel();
			}
		},
		[onCancel],
	);

	return <input ref={ref} onKeyDown={onKeyDown} placeholder="Input" />;
};

export default () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isInputVisible, setIsInputVisible] = useState(false);

	const ref = useRef<HTMLButtonElement>(null);

	const onCancel = useCallback(() => {
		setIsInputVisible(false);
		ref.current?.focus();
	}, []);

	return (
		<div>
			<Popup
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				shouldReturnFocus={false}
				placement="bottom-start"
				content={({ setInitialFocusRef }) => (
					<button
						ref={setInitialFocusRef}
						type="button"
						onClick={() => {
							setIsOpen(false);
							setIsInputVisible(true);
						}}
					>
						Content
					</button>
				)}
				trigger={(triggerProps) => (
					<button
						{...triggerProps}
						ref={mergeRefs([ref, triggerProps.ref])}
						type="button"
						onClick={() => setIsOpen(!isOpen)}
					>
						Trigger
					</button>
				)}
			/>
			{isInputVisible ? <TestInput onCancel={onCancel} /> : null}
		</div>
	);
};
