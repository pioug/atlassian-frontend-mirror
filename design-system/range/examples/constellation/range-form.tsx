import React from 'react';

import Button from '@atlaskit/button/new';
import Form, { FormFooter, HelperMessage, RangeField } from '@atlaskit/form';
import Range from '@atlaskit/range';

export default function TextFieldFormExample() {
	return (
		<Form onSubmit={(formState: unknown) => console.log('form submitted', formState)}>
			<RangeField label="Adjust brightness" name="example-text" defaultValue={50}>
				{({ fieldProps }) => (
					<>
						<Range {...fieldProps} />
						<HelperMessage>
							Move the slider to set your preferred brightness level, then press submit.
						</HelperMessage>
					</>
				)}
			</RangeField>
			<FormFooter>
				<Button type="submit" appearance="primary">
					Submit
				</Button>
			</FormFooter>
		</Form>
	);
}
