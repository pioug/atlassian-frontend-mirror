import React from 'react';

import Button from '@atlaskit/button/new';
import Form, { FormFooter, RangeField } from '@atlaskit/form';
import { Box } from '@atlaskit/primitives';
import Range from '@atlaskit/range';

const FormRangeFieldExample = () => {
	return (
		<Box>
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
		</Box>
	);
};

export default FormRangeFieldExample;
