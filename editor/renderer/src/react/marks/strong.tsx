import React from 'react';
import { type MarkProps } from '../types';

export default function Strong(props: MarkProps) {
	// ignore the eslint warning Text primitive does not support dataAttributes
	// eslint-disable-next-line @atlaskit/design-system/use-primitives-text
	return <strong {...props.dataAttributes}>{props.children}</strong>;
}
