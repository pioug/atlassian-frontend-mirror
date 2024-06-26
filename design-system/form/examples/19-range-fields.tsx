import React from 'react';

import Button from '@atlaskit/button/new';
import Range from '@atlaskit/range';

import Form, { FormFooter, RangeField } from '../src';

export default function RangeFieldExample() {
	return (
		<div>
			<Form onSubmit={(data) => console.log(data)}>
				{({ formProps }) => (
					<form {...formProps}>
						<RangeField name="threshold" defaultValue={50} label="Threshold">
							{({ fieldProps }) => <Range {...fieldProps} min={0} max={70} />}
						</RangeField>

						<FormFooter>
							<Button type="submit" appearance="primary">
								Submit
							</Button>
						</FormFooter>
					</form>
				)}
			</Form>
		</div>
	);
}
