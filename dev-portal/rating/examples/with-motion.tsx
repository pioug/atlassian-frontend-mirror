import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import { StaggeredEntrance, ZoomIn } from '@atlaskit/motion';

import { RatingGroup, Star, type StarProps } from '../src';

const ZoomInStar = (props: StarProps) => (
	<ZoomIn>{(motion) => <Star {...motion} {...props} />}</ZoomIn>
);

export default () => {
	const [count, setCount] = useState(0);

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={{ textAlign: 'center' }}>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ marginBottom: 8 }}>
				<Button onClick={() => setCount((prev) => prev + 1)}>Re-enter</Button>
			</div>

			<StaggeredEntrance>
				<RatingGroup key={count} groupName="rating--motion">
					<ZoomInStar label="Terrible" value="one" />
					<ZoomInStar label="Meh" value="two" />
					<ZoomInStar label="Good" value="three" />
					<ZoomInStar label="Great" value="four" />
					<ZoomInStar label="Fantastic!" value="five" />
				</RatingGroup>
			</StaggeredEntrance>
		</div>
	);
};
