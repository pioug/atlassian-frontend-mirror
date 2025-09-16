/* eslint-disable @atlaskit/design-system/no-html-button */
/* eslint-disable react/no-array-index-key */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useEffect, useState } from 'react';

import { css, jsx } from '@compiled/react';

import { Checkbox } from '@atlaskit/checkbox';
import { calculateADFComplexity } from '@atlaskit/editor-performance-metrics/page-complexity-score';
import type {
	DebugNodePath,
	ComplexityResult,
	AdfNode,
} from '@atlaskit/editor-performance-metrics/src/page-complexity-score/types';
import TextArea from '@atlaskit/textarea';
import { token } from '@atlaskit/tokens';

import bigDocumentADF from './big-document.json';

const mainStyles = css({
	minWidth: '100vw',
	minHeight: '100vh',
	maxHeight: '100vh',
	backgroundColor: '#f5f5f5',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	padding: '2rem',
});

const executionTimeStyle = css({
	marginTop: '1rem',
	color: '#666',
	fontSize: '0.9rem',
	fontStyle: 'italic',
});

const containerStyle = css({
	width: '80%',
	maxWidth: '800px',
	backgroundColor: 'white',
	borderRadius: '8px',
	padding: '2rem',
	boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
});

const inputStyle = css({
	width: '100%',
	minHeight: '100px',
	padding: '1rem',
	marginBottom: '1rem',
	borderRadius: '4px',
	borderColor: '#ccc',
	borderStyle: 'solid',
	borderWidth: token('border.width'),
	fontFamily: 'monospace',
});

const resultStyle = css({
	marginTop: '2rem',
});

const pathItemStyle = css({
	padding: '0.5rem',
	margin: '0.5rem 0',
	backgroundColor: '#f8f9fa',
	borderRadius: '4px',
	borderColor: '#e9ecef',
	borderStyle: 'solid',
	borderWidth: token('border.width'),
});

const weightStyle = css({
	fontSize: '1.5rem',
	fontWeight: 'bold',
	color: '#2c3e50',
	marginBottom: '1rem',
});

const buttonStyle = css({
	padding: '0.5rem 1rem',
	backgroundColor: '#4CAF50',
	color: 'white',
	border: 'none',
	borderRadius: '4px',
	cursor: 'pointer',
	'&:hover': {
		backgroundColor: '#45a049',
	},
});

const errorStyle = css({ color: 'red', marginTop: '1rem' });
const h2Style = css({ marginBottom: '1rem' });
const pathArrowStyle = css({
	color: '#666',
	margin: '0 8px',
});

const leafNodeButtonStyle = css({
	background: 'none',
	border: 'none',
	cursor: 'pointer',
	color: '#2196F3',
	fontFamily: 'monospace',
	fontSize: '14px',
	padding: '4px 8px',
	borderRadius: '4px',
	'&:hover': {
		backgroundColor: '#e3f2fd',
	},
});

const leafNodeDetailsStyle = css({
	marginTop: '8px',
	padding: '12px',
	backgroundColor: '#e3f2fd',
	borderRadius: '4px',
	fontSize: '14px',
});

const checkboxContainerStyle = css({
	display: 'flex',
	alignItems: 'center',
	marginBottom: '1rem',
	gap: '0.5rem',
});

const checkboxLabelStyle = css({
	fontSize: '0.9rem',
	color: '#666',
	cursor: 'pointer',
});

const checkboxStyle = css({
	cursor: 'pointer',
});
const executionHistoryStyle = css({
	padding: '1rem',
	backgroundColor: '#f8f9fa',
	borderRadius: '4px',
	borderColor: '#e9ecef',
	borderStyle: 'solid',
	borderWidth: token('border.width'),
});

const executionHistoryItemStyle = css({
	display: 'flex',
	gap: '10px',
	padding: '0.5rem',
	borderBottom: `${token('border.width')} solid #e9ecef`,
});
const calculateAverage = (times: Array<{ time: number }>) => {
	if (times.length === 0) {
		return 0;
	}
	const sum = times.reduce((acc, curr) => acc + curr.time, 0);
	return sum / times.length;
};
const executionHistoryHeaderStyle = css({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	marginBottom: '0.5rem',
});

const averageStyle = css({
	color: '#666',
	fontSize: '0.9rem',
});

const ExecutionHistory = ({ history }: { history: Array<{ time: number }> }) => {
	if (history.length === 0) {
		return null;
	}

	const average = calculateAverage(history);

	return (
		<div css={executionHistoryStyle}>
			<div css={executionHistoryHeaderStyle}>
				<h3>Last executions:</h3>
				<span css={averageStyle}>Average: {average.toFixed(2)}ms</span>
			</div>
			<div css={executionHistoryItemStyle}>
				{history.map((execution, index) => (
					<span key={index}>{execution.time.toFixed(2)}ms</span>
				))}
			</div>
		</div>
	);
};

const ComplexityViewer = () => {
	const [input, setInput] = useState(JSON.stringify(bigDocumentADF));
	const [result, setResult] = useState<ComplexityResult | null>(null);
	const [error, setError] = useState('');
	const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
	const [executionTime, setExecutionTime] = useState<number | null>(null);
	const [useWebWorker, setUseWebWorker] = useState(false);
	const [showDebugPath, setShowDebugPath] = useState(true);
	const [executionHistory, setExecutionHistory] = useState<Array<{ time: number }>>([]);

	const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setInput(e.target.value);
		setError('');
	}, []);

	useEffect(() => {
		if (typeof executionTime !== 'number') {
			return;
		}

		setExecutionHistory((prev) => [
			{
				time: executionTime,
			},
			...prev,
		]);
	}, [executionTime]);

	const handleSubmit = useCallback(async () => {
		let parsedResult: AdfNode;
		try {
			parsedResult = JSON.parse(input);
		} catch (e) {
			setError('Invalid JSON format');
			setResult(null);
			setExecutionTime(null);
			return;
		}

		try {
			const startTime = performance.now();
			const result = await calculateADFComplexity(
				parsedResult,
				{
					calculateNodePaths: showDebugPath,
				},
				useWebWorker,
			);
			const endTime = performance.now();

			setResult({
				weight: result.weight,
				debugPaths: result.debugPaths || [],
			});
			setExecutionTime(endTime - startTime);
			setError('');
		} catch (e) {
			setError('Something wrong!');
			setResult(null);
			setExecutionTime(null);
		}
	}, [input, useWebWorker, showDebugPath]);

	const toggleNodeDetails = useCallback((pathIndex: number, nodeIndex: number) => {
		const key = `${pathIndex}-${nodeIndex}`;
		setExpandedNodes((prev) => ({
			...prev,
			[key]: !prev[key],
		}));
	}, []);

	const renderPath = (path: DebugNodePath, pathIndex: number) => {
		return (
			<div css={pathItemStyle}>
				{path.map((node, nodeIndex) => {
					const isLast = nodeIndex === path.length - 1;
					const key = `${pathIndex}-${nodeIndex}`;
					const isExpanded = expandedNodes[key];

					if (typeof node === 'string') {
						return (
							<span key={nodeIndex}>
								{node}
								{!isLast && <span css={pathArrowStyle}>→</span>}
							</span>
						);
					}

					return (
						<span key={nodeIndex}>
							<button
								css={leafNodeButtonStyle}
								onClick={() => toggleNodeDetails(pathIndex, nodeIndex)}
							>
								[{node.type}: {node.totalWeight}]
							</button>
							{isExpanded && (
								<div css={leafNodeDetailsStyle}>
									<div>Default weight: {node.baseWeight}</div>
									<div>Parents weight: {node.parentWeight}</div>
									<div>Amount: {node.count}</div>
									<div>Total: {node.totalWeight}</div>
								</div>
							)}
						</span>
					);
				})}
			</div>
		);
	};
	const handleWorkerToggle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setUseWebWorker(e.target.checked);
	}, []);
	const handleDebugPathToggle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setShowDebugPath(e.target.checked);
	}, []);

	return (
		<div css={containerStyle}>
			<h2 css={h2Style}>Complexity Result Viewer</h2>
			<div css={checkboxContainerStyle}>
				<Checkbox
					id="useWebWorker"
					isChecked={useWebWorker}
					onChange={handleWorkerToggle}
					css={checkboxStyle}
				/>
				<label htmlFor="useWebWorker" css={checkboxLabelStyle}>
					Use Web Worker (Run asynchronously)
				</label>
			</div>
			<div css={checkboxContainerStyle}>
				<Checkbox
					type="checkbox"
					id="showDebugPath"
					isChecked={showDebugPath}
					onChange={handleDebugPathToggle}
					css={checkboxStyle}
				/>
				<label htmlFor="showDebugPath" css={checkboxLabelStyle}>
					Show debug path
				</label>
			</div>
			<TextArea
				css={inputStyle}
				value={input}
				onChange={handleInputChange}
				placeholder="Paste your doc tree here..."
			/>
			<button onClick={handleSubmit} css={buttonStyle}>
				Check page score
			</button>

			{error && <div css={errorStyle}>{error}</div>}

			{executionTime !== null && (
				<div css={executionTimeStyle}>
					Execution time: {executionTime.toFixed(2)}ms
					{useWebWorker ? ' (Web Worker)' : ' (Synchronous)'}
					<ExecutionHistory history={executionHistory} />
				</div>
			)}

			{result && (
				<div css={resultStyle}>
					<div css={weightStyle}>Total Weight: {result.weight}</div>
					<h3>Debug Paths:</h3>
					<p>
						Each leaf node weight is calculated using the follow expression:
						<br />
						<span>total_weight = ( base_weight * amount ) * parent_weight</span>
					</p>

					{result.debugPaths?.map((path, pathIndex) => (
						<div key={pathIndex}>{renderPath(path, pathIndex)}</div>
					))}
				</div>
			)}
		</div>
	);
};

export default function Example() {
	return (
		<main id="app-main" css={mainStyles}>
			<ComplexityViewer />
		</main>
	);
}
