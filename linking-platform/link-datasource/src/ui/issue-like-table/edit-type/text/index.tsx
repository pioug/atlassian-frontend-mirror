import React from 'react';

import { UNSAFE_LAYERING } from '@atlaskit/layering';
import Textfield from '@atlaskit/textfield';

interface TextEditTypeProps extends React.ComponentProps<typeof Textfield> {}

const TextEditType = (props: TextEditTypeProps) => (
	<UNSAFE_LAYERING isDisabled={false}>
		<Textfield {...props} autoFocus isCompact testId="inline-edit-text" />
	</UNSAFE_LAYERING>
);

export default TextEditType;
