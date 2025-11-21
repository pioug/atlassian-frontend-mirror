import React from 'react';

import Button from '@atlaskit/button/new';
import Form, { FormFooter, RangeField } from '@atlaskit/form';
import Range from '@atlaskit/range';

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
