import React from 'react';

import { codeFontFamily, fontFamily, fontSize, fontSizeSmall } from '../src';

export default () => {
	return (
		<div>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
			<div style={{ fontSize: fontSize() }}>Standard font size</div>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
			<div style={{ fontSize: fontSizeSmall() }}>Small font size</div>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
			<div style={{ fontFamily: fontFamily() }}>OS specific font family</div>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
			<div style={{ fontFamily: codeFontFamily() }}>OS specific code font size</div>
		</div>
	);
};
