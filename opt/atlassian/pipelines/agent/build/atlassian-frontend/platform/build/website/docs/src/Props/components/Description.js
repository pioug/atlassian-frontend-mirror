import React from 'react';

export default function ReadmeDescription({ children }) {
	const style = { marginTop: 12 };

	return typeof children === 'string' ? (
		<p>{children}</p>
	) : (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={style}>{children}</div>
	);
}
