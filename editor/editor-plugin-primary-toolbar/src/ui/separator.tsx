/** @jsx jsx */
import { jsx } from '@emotion/react';

import { separatorStyles, wrapperStyle } from '@atlaskit/editor-common/styles';

export default () => (
	<span css={wrapperStyle}>
		<span css={separatorStyles} />
	</span>
);
