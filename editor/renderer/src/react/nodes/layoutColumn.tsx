/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx, css } from '@emotion/react';

import {
	WidthProvider,
	clearNextSiblingMarginTopStyle,
	clearNextSiblingBlockMarkMarginTopStyle,
} from '@atlaskit/editor-common/ui';

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
const layoutColumnClearMarginTopStyles = css(
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	clearNextSiblingMarginTopStyle,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	clearNextSiblingBlockMarkMarginTopStyle,
);

export default function LayoutSection(props: React.PropsWithChildren<{ width?: number }>) {
	return (
		<div
			data-layout-column
			data-column-width={props.width}
			style={{ flexBasis: `${props.width}%` }}
		>
			<WidthProvider>
				<div css={layoutColumnClearMarginTopStyles} />
				{props.children}
			</WidthProvider>
		</div>
	);
}
