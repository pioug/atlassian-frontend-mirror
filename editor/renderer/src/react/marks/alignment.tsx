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
import { componentWithFG } from '@atlaskit/platform-feature-flags-react';

type MarkWrapperProps = {
	'data-align': AlignmentAttributes['align'];
};

const MarkWrapperOld = (
	props: React.PropsWithChildren<MarkWrapperProps & React.HTMLAttributes<HTMLDivElement>>,
) => {
	const styles = props['data-align']
		? // eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
			css`
				text-align: ${alignmentPositionMap[props['data-align']]};
			`
		: '';
	return (
		<div
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
			css={styles}
			// Ignored via go/ees005
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props}
		>
			{props.children}
		</div>
	);
};

const MarkWrapperNew = (
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

const MarkWrapper = componentWithFG(
	'platform_editor_emotion_refactor_renderer',
	MarkWrapperNew,
	MarkWrapperOld,
);

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
