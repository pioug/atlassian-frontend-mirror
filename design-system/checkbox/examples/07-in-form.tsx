import React from 'react';

import Button from '@atlaskit/button/new';
import { Checkbox } from '@atlaskit/checkbox';
import Form, { CheckboxField, FormFooter } from '@atlaskit/form';

export default () => (
	<Form<{ remember: boolean }> onSubmit={() => {}}>
		<CheckboxField name="remember" isRequired>
			{({ fieldProps }) => <Checkbox {...fieldProps} label="Remember me" />}
		</CheckboxField>
		<FormFooter>
			<Button type="submit">Next</Button>
		</FormFooter>
	</Form>
);
