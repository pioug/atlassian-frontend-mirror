import React from 'react';

import Textfield from '@atlaskit/textfield';

interface TextEditTypeProps extends React.ComponentProps<typeof Textfield> {}

const TextEditType = (props: TextEditTypeProps) => (
	<Textfield {...props} autoFocus isCompact testId="inline-edit-text" />
);

export default TextEditType;
