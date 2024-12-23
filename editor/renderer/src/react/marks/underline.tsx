import React from 'react';
import { type MarkProps } from '../types';

export default function Underline(props: MarkProps) {
	// Ignored via go/ees005
	// eslint-disable-next-line react/jsx-props-no-spreading
	return <u {...props.dataAttributes}>{props.children}</u>;
}
