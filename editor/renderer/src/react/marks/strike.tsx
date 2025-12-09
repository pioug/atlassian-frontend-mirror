import React from 'react';
import { type MarkProps } from '../types';

export default function Strike(props: MarkProps): React.JSX.Element {
	return (
		<span
			// Ignored via go/ees005
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props.dataAttributes}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={{ textDecoration: 'line-through' }}
		>
			{props.children}
		</span>
	);
}
