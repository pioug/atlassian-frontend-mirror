/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button';

const containerStyles = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
});

export const Centered = ({
	as: As = 'div',
	...props
}: React.HTMLProps<HTMLDivElement> & { as?: keyof JSX.IntrinsicElements }) => (
	<As
		css={containerStyles}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
		className={props.className}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
		style={props.style}
	>
		{props.children}
	</As>
);

export const RetryContainer = (props: { children: React.ReactNode }) => {
	const [count, setCount] = useState(0);
	const increment = () => setCount((prev) => prev + 1);

	return (
		<div key={count}>
			{props.children}

			<Centered>
				<Button appearance="primary" onClick={increment}>
					Re-enter
				</Button>
			</Centered>
		</div>
	);
};
