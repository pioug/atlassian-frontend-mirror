/** @jsx jsx */
import { jsx } from '@emotion/react';

import { separatorStyles, wrapperStyle } from '@atlaskit/editor-common/styles';

export default () => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
	<span css={wrapperStyle}>
		{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
		<span css={separatorStyles} />
	</span>
);
