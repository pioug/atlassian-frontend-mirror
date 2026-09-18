/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

/* eslint-disable @typescript-eslint/consistent-type-imports, @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766; jsx required at runtime for @jsxRuntime classic */
import { jsx } from '@emotion/react';

import type { AlignmentAttributes } from '@atlaskit/adf-schema/alignment';
import { alignmentPositionMap } from '@atlaskit/adf-schema/alignment';

import type { MarkProps } from '../types';

type MarkWrapperProps = {
	'data-align': AlignmentAttributes['align'];
};

const MarkWrapper = (
	props: React.PropsWithChildren<MarkWrapperProps & React.HTMLAttributes<HTMLDivElement>>,
) => {
	const dataAlign = props['data-align']
		? (alignmentPositionMap[props['data-align']] as React.CSSProperties['textAlign'])
		: undefined;
	return (
		<div
			style={{
				textAlign: dataAlign,
			}}
			// Ignored via go/ees005
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props}
		>
			{props.children}
		</div>
	);
};

export default function Alignment(props: MarkProps<AlignmentAttributes>): jsx.JSX.Element {
	return (
		<MarkWrapper
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className="fabric-editor-block-mark fabric-editor-alignment"
			data-align={props.align}
		>
			{props.children}
		</MarkWrapper>
	);
}
