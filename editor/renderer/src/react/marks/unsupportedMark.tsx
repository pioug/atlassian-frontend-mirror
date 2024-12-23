import React from 'react';
import { type MarkProps } from '../types';

export default function UnsupportedMark(props: MarkProps) {
	// Ignored via go/ees005
	// eslint-disable-next-line react/jsx-props-no-spreading
	return <span {...props.dataAttributes}>{props.children}</span>;
}
