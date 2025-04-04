import React from 'react';
import Inline from './inline';
import { type NodeProps } from '../types';

export default function Paragraph({ children, dataAttributes }: NodeProps) {
	return (
		// ignore the eslint warning Text primitive does not support dataAttributes
		// eslint-disable-next-line @atlaskit/design-system/use-primitives-text
		// Ignored via go/ees005
		// eslint-disable-next-line react/jsx-props-no-spreading, @atlaskit/design-system/use-primitives-text
		<p {...dataAttributes}>
			<Inline>{children}</Inline>
		</p>
	);
}
