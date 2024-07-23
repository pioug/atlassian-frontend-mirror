/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import type { AlignmentAttributes } from '@atlaskit/adf-schema';
import { alignmentPositionMap } from '@atlaskit/adf-schema';
import type { MarkProps } from '../types';

type MarkWrapperProps = {
	'data-align': AlignmentAttributes['align'];
};

const MarkWrapper = (
	props: React.PropsWithChildren<MarkWrapperProps & React.HTMLAttributes<HTMLDivElement>>,
) => {
	const styles = props['data-align']
		? // eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
			css`
				text-align: ${alignmentPositionMap[props['data-align']]};
			`
		: '';
	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
		<div css={styles} {...props}>
			{props.children}
		</div>
	);
};

export default function Alignment(props: MarkProps<AlignmentAttributes>) {
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
