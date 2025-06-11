/* eslint-disable @atlaskit/design-system/no-html-button */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useEffect, useState } from 'react';

import { jsx } from '@compiled/react';

import type { WindowWithEditorPerformanceGlobals } from '../__tests__/playwright/window-type';
import { setupINPTracking } from '../src/inp';

function simulateHeavyTask() {
	const start = performance.now();
	let now = start;
	while (now - start < 200) {
		now = performance.now();
	}
}

const InteractiveElements = () => {
	const [buttonClicks, setButtonClicks] = useState(0);
	const [inputValue, setInputValue] = useState('');
	const [selectedOption, setSelectedOption] = useState('option1');
	const [inpData, setInpData] = useState<object | null>(null);

	useEffect(() => {
		setupINPTracking((data) => {
			setInpData({ timestamp: performance.now(), ...data });
		});
	}, []);

	const handleButtonClick = useCallback(() => {
		(window as WindowWithEditorPerformanceGlobals).__editor_metrics_tests_tick?.(true);

		simulateHeavyTask();
		setButtonClicks((prev) => prev + 1);

		(window as WindowWithEditorPerformanceGlobals).__editor_metrics_tests_tick?.(true);
	}, []);

	const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		(window as WindowWithEditorPerformanceGlobals).__editor_metrics_tests_tick?.(true);

		simulateHeavyTask();
		setInputValue(e.target.value);

		(window as WindowWithEditorPerformanceGlobals).__editor_metrics_tests_tick?.(true);
	}, []);

	const handleSelectChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
		(window as WindowWithEditorPerformanceGlobals).__editor_metrics_tests_tick?.(true);

		simulateHeavyTask();
		setSelectedOption(e.target.value);

		(window as WindowWithEditorPerformanceGlobals).__editor_metrics_tests_tick?.(true);
	}, []);

	return (
		<div>
			<div>
				<button data-testid="inp-button" onClick={handleButtonClick}>
					Click me ({buttonClicks})
				</button>

				<input
					data-testid="inp-input"
					type="text"
					value={inputValue}
					onChange={handleInputChange}
					placeholder="Type something..."
				/>

				{/* eslint-disable-next-line @atlaskit/design-system/no-html-select */}
				<select data-testid="inp-select" value={selectedOption} onChange={handleSelectChange}>
					<option value="option1">Option 1</option>
					<option value="option2">Option 2</option>
					<option value="option3">Option 3</option>
				</select>
			</div>
			<div>
				<h3>INP (Interaction to Next Paint):</h3>
				{inpData !== null ? (
					<div>
						<pre>{JSON.stringify(inpData, null, 2)}</pre>
					</div>
				) : (
					<p>No interactions recorded yet</p>
				)}
			</div>
		</div>
	);
};

export default function Example() {
	return <InteractiveElements />;
}
