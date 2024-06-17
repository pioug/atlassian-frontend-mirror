/** @jsx jsx */
import React, { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/custom-theme-button';

const containerStyles = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
});

export const Centered = ({
	as: As = 'div',
	...props
}: React.HTMLProps<HTMLDivElement> & { as?: keyof JSX.IntrinsicElements }) => {
	const Component = As as React.ElementType;

	return (
		<Component
			css={containerStyles}
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
			{...props}
		/>
	);
};

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
