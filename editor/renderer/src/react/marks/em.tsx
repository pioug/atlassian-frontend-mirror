import React from 'react';
import { type MarkProps } from '../types';

export default function Em(props: MarkProps) {
	// ignore the eslint warning Text primitive does not support dataAttributes
	// eslint-disable-next-line @atlaskit/design-system/use-primitives-text
	// Ignored via go/ees005
	// eslint-disable-next-line react/jsx-props-no-spreading
	return <em {...props.dataAttributes}>{props.children}</em>;
}
