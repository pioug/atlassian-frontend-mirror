import React from 'react';

import Button from '@atlaskit/button/default/button';
import Form from '@atlaskit/form/form';
import { FormFooter } from '@atlaskit/form/form-footer';
import { HelperMessage } from '@atlaskit/form/helper-message';
import { RangeField } from '@atlaskit/form/range-field';
import Range from '@atlaskit/range/range';

export default function TextFieldFormExample(): React.JSX.Element {
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
