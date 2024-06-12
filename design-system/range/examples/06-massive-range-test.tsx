import React, { useState } from 'react';

import styled from '@emotion/styled';

import { Label } from '@atlaskit/form';

import Range from '../src';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Container = styled.div({
	width: '500px',
});

const max = 100000;

function MassiveRangeTest() {
	const [value, setValue] = useState(0);

	const onChange = (value: any) => {
		setValue(value);
	};

	return (
		<div>
			<Container>
				<Label htmlFor="range-massive">Massive range</Label>
				<Range id="range-massive" max={100000} step={1} onChange={onChange} />
				Value:{value}
			</Container>
			<div
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					borderStyle: 'dashed',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					borderWidth: '1px',

					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					borderColor: '#ccc',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					padding: '0.5em',

					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					color: '#ccc',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					margin: '0.5em',
				}}
			>
				Range: 0-{max} | Step: 1 |
				{value ? ` onChange called with value ${value}` : ' Interact to trigger onChange'}
			</div>
		</div>
	);
}

export default MassiveRangeTest;
