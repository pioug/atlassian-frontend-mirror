/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { CustomBlock } from '@atlaskit/smart-card';

export default () => {
	return (
		<div>
			<CustomBlock>
				<div>Block 1</div>
				<div>Block 2</div>
				<div>Block 3</div>
			</CustomBlock>
		</div>
	);
};
