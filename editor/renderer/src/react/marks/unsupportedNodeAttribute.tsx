import React from 'react';
import { type MarkProps } from '../types';

export default function UnsupportedNodeAttribute(props: MarkProps): React.JSX.Element {
	// Ignored via go/ees005
	// eslint-disable-next-line react/jsx-props-no-spreading
	return <span {...props.dataAttributes}>{props.children}</span>;
}
