import React from 'react';
import type { FontSizeMarkAttrs } from '@atlaskit/adf-schema';
import type { MarkProps } from '../types';

export default function FontSize(props: MarkProps<FontSizeMarkAttrs>): React.JSX.Element {
	return (
		<div
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className="fabric-editor-block-mark fabric-editor-font-size"
			data-font-size={props.fontSize}
		>
			{props.children}
		</div>
	);
}
