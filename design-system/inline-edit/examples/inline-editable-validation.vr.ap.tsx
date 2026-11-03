import React from 'react';

import { cssMap } from '@atlaskit/css';
import InlineEditableTextfield from '@atlaskit/inline-edit/inline-editable-textfield';
import { Box } from '@atlaskit/primitives/compiled/box';

const styles = cssMap({
	container: {
		width: '400px',
	},
});

const shortError = 'Enter a name';
const longError =
	'Enter a name longer than six characters. Use a descriptive name so people can distinguish this category from similar categories when browsing the list or searching for a ticket type. Names should identify the purpose of the category clearly, without requiring people to open it to understand what it contains.';

function ValidationExample({ message }: { message: string }) {
	return (
		<Box xcss={styles.container} paddingBlock="space.1000" paddingInline="space.200">
			<InlineEditableTextfield
				defaultValue="Existing name"
				placeholder=""
				label="Name"
				startWithEditViewOpen
				validate={(value) => (value.trim() ? undefined : message)}
				onConfirm={() => {}}
			/>
		</Box>
	);
}

export const ShortError = (): React.JSX.Element => <ValidationExample message={shortError} />;
export const LongError = (): React.JSX.Element => <ValidationExample message={longError} />;

export default ShortError;
