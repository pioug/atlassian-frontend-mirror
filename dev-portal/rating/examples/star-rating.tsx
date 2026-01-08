import React, { useState } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { G300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { RatingGroup, Star } from '../src';

export default (): React.JSX.Element => {
	const [color, setColor] = useState<string>();

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={{ textAlign: 'center' }}>
			<ButtonGroup>
				<Button
					isSelected={!!color}
					onClick={() =>
						setColor((prev) => (prev ? undefined : token('color.icon.accent.green', G300)))
					}
				>
					{color ? 'Reset color' : 'Use custom color'}
				</Button>
			</ButtonGroup>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ margin: '16px 0 8px' }}>
				<RatingGroup groupName="rating--star">
					<Star color={color} label="Terrible" value="one" />
					<Star color={color} label="Meh" value="two" />
					<Star color={color} label="Good" value="three" />
					<Star color={color} label="Great" value="four" />
					<Star color={color} label="Fantastic!" value="five" />
				</RatingGroup>
			</div>
		</div>
	);
};
