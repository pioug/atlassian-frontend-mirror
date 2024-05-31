import React from 'react';
import { type MarkProps } from '../types';

export default function Strong(props: MarkProps) {
	return <strong {...props.dataAttributes}>{props.children}</strong>;
}
