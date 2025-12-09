import React from 'react';

import Button from '@atlaskit/button/new';
import Form, { FormFooter, RangeField } from '@atlaskit/form';
import { Box } from '@atlaskit/primitives/compiled';
import Range from '@atlaskit/range';

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
