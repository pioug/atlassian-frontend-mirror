import React from 'react';

import { Label } from '@atlaskit/form';

import Range from '../src';

const baseProps = {
	min: -50,
	max: 50,
};

const RangeValues = () => (
	<div data-testid="container">
		<section>
			<h2>With Default Values</h2>
			<Label htmlFor="range-0">Default 0%</Label>
			<Range id="range-0" {...baseProps} value={-50} />

			<Label htmlFor="range-25">Default 25%</Label>
			<Range id="range-25" {...baseProps} value={-25} />

			<Label htmlFor="range-50">Default 50%</Label>
			<Range id="range-50" {...baseProps} value={0} />

			<Label htmlFor="range-75">Default 75%</Label>
			<Range id="range-75" {...baseProps} value={25} />

			<Label htmlFor="range-100">Default 100%</Label>
			<Range id="range-100" {...baseProps} value={50} />
		</section>
		<section>
			<h2>Correct display</h2>
			<Label htmlFor="range-min">
				If <code>value</code> &lt; <code>min</code>
			</Label>
			<Range id="range-min" {...baseProps} value={-100} />

			<Label htmlFor="range-max">
				If <code>value</code> &gt; <code>max</code>
			</Label>
			<Range id="range-max" {...baseProps} value={100} />
		</section>
		<section>
			<h2>Correctly rounding blue track width to align with thumb</h2>
			{/* Cases which were previously identified to have issues */}
			<Label htmlFor="range-20">Step 20</Label>
			<Range id="range-20" value={30} min={-50} max={50} step={20} />
			<Label htmlFor="range-1">Step 1</Label>
			<Range id="range-1" value={42.5} min={30} max={80} step={1} />
			<Label htmlFor="range-10">Step 10</Label>
			<Range id="range-10" value={42.5} min={30} max={80} step={10} />
		</section>
	</div>
);

export default RangeValues;
