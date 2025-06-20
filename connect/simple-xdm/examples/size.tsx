// @ts-nocheck
import React from 'react';

import Button from '@atlaskit/button/new';

import ConfigurationOptions from '../src/plugin/configuration-options';
import size from '../src/plugin/size';

export default function Size() {
	const clearResultsDiv = () => {
		const results = document.getElementById('results');
		results!.innerHTML = '';
	};

	const sizeCalculates100WidthByDefault = () => {
		clearResultsDiv();

		const width = 120;
		const container = document.getElementById('content');
		container?.setAttribute('style', 'width:' + width + 'px; height:1px;');

		const dimensions = size();

		const results = document.getElementById('results');
		results!.innerHTML = JSON.stringify(dimensions);
	};

	const sizeCalculatesCorrectHeight = () => {
		clearResultsDiv();

		const container = document.getElementById('content');
		container?.setAttribute('style', 'width:1px; height:110px;');

		const dimensions = size();

		const results = document.getElementById('results');
		results!.innerHTML = JSON.stringify(dimensions);
	};

	const sizeCalculatesCorrectHeightMargin = () => {
		clearResultsDiv();

		const container = document.getElementById('content');
		container?.setAttribute('style', 'width:1px; height:110px;margin-bottom:10px');

		const dimensions = size();

		const results = document.getElementById('results');
		results!.innerHTML = JSON.stringify(dimensions);
	};

	const sizeCalculatesCorrectHeightBorder = () => {
		clearResultsDiv();

		const container = document.getElementById('content');
		container?.setAttribute('style', 'width:1px; height:110px;border-top:4px solid red');

		const dimensions = size();

		const results = document.getElementById('results');
		results!.innerHTML = JSON.stringify(dimensions);
	};

	const sizeCalculatesCorrectHeightPadding = () => {
		clearResultsDiv();

		const container = document.getElementById('content');
		container?.setAttribute('style', 'width:1px; height:110px;padding-top:4px;');

		const dimensions = size();

		const results = document.getElementById('results');
		results!.innerHTML = JSON.stringify(dimensions);
	};

	const sizeCalculatesCorrectHeightPaddingMargin = () => {
		clearResultsDiv();

		const container = document.getElementById('content');
		container?.setAttribute('style', 'width:1px; height:110px;padding-top:4px;margin-top:4px');

		const dimensions = size();

		const results = document.getElementById('results');
		results!.innerHTML = JSON.stringify(dimensions);
	};

	const sizeCalculatesCorrectWidth = () => {
		clearResultsDiv();

		const container = document.getElementById('content');
		container?.setAttribute('style', 'width:120px; height:1;');

		ConfigurationOptions.set('widthinpx', true);
		const dimensions = size();

		const results = document.getElementById('results');
		results!.innerHTML = JSON.stringify(dimensions);
	};

	return (
		<div>
			<div id="results" data-testid="results" />
			<div>
				<Button onClick={sizeCalculates100WidthByDefault} id="size-calc-100-width-by-default">
					Size calculates 100% width by default
				</Button>
				<Button onClick={sizeCalculatesCorrectHeight} id="size-calc-correct-height">
					Size calculates correct height
				</Button>
				<Button onClick={sizeCalculatesCorrectHeightMargin} id="size-calc-correct-height-margin">
					Size calculates correct height with margin
				</Button>
				<Button onClick={sizeCalculatesCorrectHeightBorder} id="size-calc-correct-height-border">
					Size calculates correct height with border
				</Button>
				<Button onClick={sizeCalculatesCorrectHeightPadding} id="size-calc-correct-height-padding">
					Size calculates correct height with padding
				</Button>
				<Button
					onClick={sizeCalculatesCorrectHeightPaddingMargin}
					id="size-calc-correct-height-padding-margin"
				>
					Size calculates correct height with padding and margin
				</Button>
				<Button onClick={sizeCalculatesCorrectWidth} id="size-calc-correct-width">
					Size calculates correct width
				</Button>
			</div>
			<div id="content">
				<p>Content</p>
			</div>
		</div>
	);
}
