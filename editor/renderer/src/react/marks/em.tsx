import React from 'react';
import { type MarkProps } from '../types';

export default function Em(props: MarkProps) {
	// ignore the eslint warning Text primitive does not support dataAttributes
	// eslint-disable-next-line @atlaskit/design-system/use-primitives-text
	return <em {...props.dataAttributes}>{props.children}</em>;
}
