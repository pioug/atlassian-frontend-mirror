import React, { useState } from 'react';
import { default as Renderer } from '../src/ui/Renderer';

type Document = {
	type: string;
	version: number;
	content: {
		type: string;
		content?: {
			type: string;
			text: string;
		}[];
	}[];
};

type Step = [string, Document];

export default function AddTelepointerExample() {
	const [updateStep, setUpdateStep] = useState(0);

	function updatedRendererValue() {
		setUpdateStep(updateStep + 1);
	}

	const step = docAdfUpdateSteps[updateStep];

	if (!step) {
		return <p>Reached final step</p>;
	}

	const [stepTitle, stepDoc] = docAdfUpdateSteps[updateStep];

	return (
		<>
			<button data-testid="add-telepointer" onClick={updatedRendererValue}>
				update renderer
			</button>
			<div data-testid="example">
				<br />
				Step title: <span>{stepTitle}</span>
				<br />
				<Renderer
					data-testid="stepTitle"
					appearance="full-width"
					// @ts-ignore
					document={stepDoc}
					addTelepointer={true}
				/>
			</div>
		</>
	);
}

const docAdfUpdateSteps: Step[] = [
	[
		'empty doc',
		{
			type: 'doc',
			version: 1,
			content: [
				{
					type: 'paragraph',
					content: [],
				},
			],
		},
	],
	[
		'add paragraph',
		{
			type: 'doc',
			version: 1,
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'This is some text',
						},
					],
				},
			],
		},
	],
	[
		'add paragraph 2',
		{
			type: 'doc',
			version: 1,
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'This is some more text',
						},
					],
				},
			],
		},
	],
];
