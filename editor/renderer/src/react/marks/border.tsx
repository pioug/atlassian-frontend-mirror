/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/* eslint-disable @typescript-eslint/consistent-type-imports, @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766; jsx required at runtime for @jsxRuntime classic */
import { jsx } from '@emotion/react';
import type { BorderMarkAttributes } from '@atlaskit/adf-schema/border';
import type { MarkProps } from '../types';

export default function Border(props: MarkProps<BorderMarkAttributes>): jsx.JSX.Element {
	const borderColor = props.color ?? '';
	const borderSize = props.size ?? 0;

	return (
		<span data-color={borderColor} data-size={borderSize} data-mark-type="border">
			{props.children}
		</span>
	);
}
