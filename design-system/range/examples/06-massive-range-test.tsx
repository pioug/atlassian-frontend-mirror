/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@compiled/react';

import { Label } from '@atlaskit/form';
import { Text } from '@atlaskit/primitives/compiled';
import Range from '@atlaskit/range';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const containerStyles = css({
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
			<div css={containerStyles}>
				<Label htmlFor="range-massive">Massive range</Label>
				<Range id="range-massive" max={100000} step={1} onChange={onChange} />
				Value:{value}
			</div>
			<div
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					borderStyle: 'dashed',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					borderWidth: token('border.width'),

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
				<Text color="color.text.subtlest">
					Range: 0-{max} | Step: 1 |
					{value ? ` onChange called with value ${value}` : ' Interact to trigger onChange'}
				</Text>
			</div>
		</div>
	);
}

export default MassiveRangeTest;
