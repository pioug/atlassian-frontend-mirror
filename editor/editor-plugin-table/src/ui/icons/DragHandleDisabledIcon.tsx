import React from 'react';

interface DragHandleDisabledIconProps {
	style?: React.CSSProperties;
}

export const DragHandleDisabledIcon = ({
	style,
}: DragHandleDisabledIconProps): React.JSX.Element => (
	<svg
		width="24"
		height="16"
		viewBox="0 0 24 16"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		style={style}
		data-testid="drag-icon-disabled"
	>
		<rect width="24" height="16" rx="4" />
		<g>
			<rect x="7" y="4" width="2" height="8" rx="1" />
			<rect x="11" y="4" width="2" height="8" rx="1" />
			<rect x="15" y="4" width="2" height="8" rx="1" />
		</g>
	</svg>
);
