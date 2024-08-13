// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import { SpanSkeleton } from '@atlaskit/linking-common';
import { token } from '@atlaskit/tokens';
import { fg } from '@atlaskit/platform-feature-flags';
import React from 'react';

// TODO: Figure out a more scalable/responsive solution
// for vertical alignment.
// Current rationale: vertically positioned at the top of
// the smart card container (when set to 0). Offset this
// to position it with appropriate whitespace from the top.
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const Icon = styled.img({
	height: '14px',
	width: '14px',
	marginRight: token('space.050', '4px'),
	borderRadius: '2px',
	userSelect: 'none',
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const IconResized = styled.img({
	height: '16px',
	width: '16px',
	marginRight: token('space.050', '4px'),
	borderRadius: '2px',
	userSelect: 'none',
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
});

// Used for 'untrue' icons which claim to be 16x16 but
// are less than that in height/width.
// TODO: Replace this override with proper AtlasKit solution.
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const AKIconWrapper = styled.span({
	marginRight: token('space.negative.025', '-2px'),
});

export const Shimmer = ({ testId }: { testId: string }) => {
	const skeletonCustomStyles: React.CSSProperties = {
		position: 'absolute',
		// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
		top: '50%',
		// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
		left: '50%',
		transform: 'translate(-50%, -50%)',
		marginRight: token('space.050', '4px'),
	};

	return (
		<SpanSkeleton
			width={fg('linking-platform-increase-inline-card-icon-size') ? 16 : 14}
			height={fg('linking-platform-increase-inline-card-icon-size') ? 16 : 14}
			borderRadius={2}
			testId={testId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={skeletonCustomStyles}
		/>
	);
};
