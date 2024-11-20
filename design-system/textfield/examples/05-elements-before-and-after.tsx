import React, { Fragment } from 'react';

import Avatar from '@atlaskit/avatar';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

export default function ElementsBeforeAfterExample() {
	return (
		<Fragment>
			<label htmlFor="after-input">After input</label>
			<Textfield
				testId="after-input"
				id="after-input"
				elemAfterInput={
					<div
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							paddingRight: token('space.075', '6px'),
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							lineHeight: '100%',
						}}
					>
						<ErrorIcon label="error" />
					</div>
				}
			/>
			<label htmlFor="before-input">Before input</label>
			<Textfield
				testId="before-input"
				id="before-input"
				elemBeforeInput={
					<div
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							paddingLeft: token('space.075', '6px'),
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							lineHeight: '100%',
						}}
					>
						<Avatar size="small" borderColor="transparent" />
					</div>
				}
			/>
		</Fragment>
	);
}
