import React from 'react';
import Inline from './inline';
import { type NodeProps } from '../types';

export default function Paragraph({ children, dataAttributes }: NodeProps) {
	return (
		<p {...dataAttributes}>
			<Inline>{children}</Inline>
		</p>
	);
}
