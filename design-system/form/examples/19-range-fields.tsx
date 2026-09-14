import React from 'react';

import Button from '@atlaskit/button/default/button';
import Form from '@atlaskit/form/form';
import { FormFooter } from '@atlaskit/form/form-footer';
import { RangeField } from '@atlaskit/form/range-field';
import Range from '@atlaskit/range/range';

export default function RangeFieldExample(): React.JSX.Element {
	return (
		<div>
			<Form onSubmit={(data) => console.log(data)}>
				<RangeField name="threshold" defaultValue={50} label="Threshold">
					{({ fieldProps }) => <Range {...fieldProps} min={0} max={70} />}
				</RangeField>

				<FormFooter>
					<Button type="submit" appearance="primary">
						Submit
					</Button>
				</FormFooter>
			</Form>
		</div>
	);
}
