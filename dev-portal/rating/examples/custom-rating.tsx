import React from 'react';

import { token } from '@atlaskit/tokens';

import { Rating, RatingGroup } from '../src';

const Emoji = ({ children, isChecked }: { children: React.ReactNode; isChecked: boolean }) => (
	<div
		style={{
			// Setting font size is important here as it's set to ZERO in the parent Rating to work around inline-block spacing issues.
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			fontSize: 30,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			margin: token('space.050', '4px'),
			opacity: isChecked ? 1 : 0.7,
		}}
	>
		{children}
	</div>
);

export default (): React.JSX.Element => {
	return (
		<div
			style={{
				margin: `${token('space.200', '16px')} 0 ${token('space.100', '8px')}`,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				textAlign: 'center',
			}}
		>
			<RatingGroup groupName="rating--custom">
				<Rating
					render={(props) => (
						<Emoji {...props}>
							<span role="img" aria-label="Crying Emoji">
								😭
							</span>
						</Emoji>
					)}
					label="OMFG"
					value="omfg"
				/>
				<Rating
					render={(props) => (
						<Emoji {...props}>
							<span role="img" aria-label="Sad Emoji">
								😞
							</span>
						</Emoji>
					)}
					label="Omg.."
					value="omg"
				/>
				<Rating
					render={(props) => (
						<Emoji {...props}>
							<span role="img" aria-label="Smiling Emoji">
								😬
							</span>
						</Emoji>
					)}
					label="Hmm"
					value="hmmm"
				/>
				<Rating
					render={(props) => (
						<Emoji {...props}>
							<span role="img" aria-label="Happy Emoji">
								🙂
							</span>
						</Emoji>
					)}
					label="It's ok"
					value="its-ok"
				/>
				<Rating
					render={(props) => (
						<Emoji {...props}>
							<span role="img" aria-label="Super Happy Emoji">
								😁
							</span>
						</Emoji>
					)}
					label="So good!"
					value="so-good"
				/>
				<Rating
					render={(props) => (
						<Emoji {...props}>
							<span role="img" aria-label="In Love Emoji">
								😍
							</span>
						</Emoji>
					)}
					label="I LOVE THIS"
					value="love-it"
				/>
			</RatingGroup>
		</div>
	);
};
