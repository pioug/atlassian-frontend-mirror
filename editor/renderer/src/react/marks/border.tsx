/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import type { BorderMarkAttributes } from '@atlaskit/adf-schema';
import type { MarkProps } from '../types';

export default function Border(props: MarkProps<BorderMarkAttributes>) {
	const borderColor = props.color ?? '';
	const borderSize = props.size ?? 0;

	return (
		<span data-color={borderColor} data-size={borderSize} data-mark-type="border">
			{props.children}
		</span>
	);
}
