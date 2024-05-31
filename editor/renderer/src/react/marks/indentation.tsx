import React from 'react';
import { type IndentationMarkAttributes } from '@atlaskit/adf-schema';
import { type MarkProps } from '../types';

export default function Indentation(props: MarkProps<IndentationMarkAttributes>) {
	return (
		<div
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className="fabric-editor-block-mark fabric-editor-indentation-mark"
			data-level={props.level}
		>
			{props.children}
		</div>
	);
}
