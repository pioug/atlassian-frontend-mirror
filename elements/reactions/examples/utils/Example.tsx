import React from 'react';

export interface ExampleProps {
	/**
	 * Body of the example (usually a React component)
	 */
	body: React.ReactNode | React.ReactElement;
	/**
	 * Title of the example
	 */
	title: React.ReactNode | React.ReactElement;
}

/**
 * A custom Example wrapper component to render different examples in the same page and minimize the amount of code needed to render these.
 * @returns JSX.Element
 */
export const Example = ({ title, body }: ExampleProps): React.JSX.Element => {
	return (
		<div
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={{ marginTop: '10px', marginLeft: '10px', marginBottom: '10px' }}
		>
			<p>
				<strong>{title}</strong>
			</p>
			{body}
		</div>
	);
};
