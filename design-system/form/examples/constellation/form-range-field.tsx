import React from 'react';

import Button from '@atlaskit/button/new';
import Form from '@atlaskit/form/form';
import { FormFooter } from '@atlaskit/form/form-footer';
import { RangeField } from '@atlaskit/form/range-field';
import { Box } from '@atlaskit/primitives/compiled/box';
import Range from '@atlaskit/range/range';

const FormRangeFieldExample = (): React.JSX.Element => {
	return (
		<Box>
			<Form onSubmit={(data) => console.log(data)}>
				<RangeField name="threshold" defaultValue={50} label="Threshold">
					{({ fieldProps }) => <Range {...fieldProps} min={0} max={70} />}
				</RangeField>

				<FormFooter align="start">
					<Button type="submit" appearance="primary">
						Submit
					</Button>
				</FormFooter>
			</Form>
		</Box>
	);
};

export default FormRangeFieldExample;
