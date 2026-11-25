import React, { useState } from 'react';

import InlineEdit from '@atlaskit/inline-edit/inline-edit';
import TextField from '@atlaskit/textfield/text-field';

export default function Example(): React.JSX.Element {
	const [value, setValue] = useState('Editable text');

	return (
		<InlineEdit<string>
			label="Description"
			defaultValue={value}
			onConfirm={(nextValue: string) => setValue(nextValue)}
			editView={({ errorMessage: _errorMessage, ...fieldProps }, ref) => (
				<TextField {...fieldProps} ref={ref} />
			)}
			readView={() => <div>{value || 'Enter a description'}</div>}
		/>
	);
}
