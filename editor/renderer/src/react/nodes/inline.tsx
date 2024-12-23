import React from 'react';

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Inline(props: any) {
	const { children } = props;
	const childCount = React.Children.toArray(children).length;

	if (!childCount) {
		return <>&nbsp;</>;
	}

	return children;
}
