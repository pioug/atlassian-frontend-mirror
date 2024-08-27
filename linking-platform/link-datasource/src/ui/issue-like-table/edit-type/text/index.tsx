import React from 'react';

import { UNSAFE_LAYERING } from '@atlaskit/layering';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

interface TextEditTypeProps extends React.ComponentProps<typeof Textfield> {}

const TextEditType = (props: TextEditTypeProps) => {
	return (
		<UNSAFE_LAYERING isDisabled={false}>
			<Textfield
				{...props}
				autoFocus
				isCompact
				testId="inline-edit-text"
				style={{
					// We need 8px left padding to match read only version, but there is already 1px of border
					padding: `${token('space.100', '8px')} calc(${token('space.100', '8px')} - 1px)`,
				}}
			/>
		</UNSAFE_LAYERING>
	);
};

export default TextEditType;
