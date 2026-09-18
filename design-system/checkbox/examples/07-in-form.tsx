import React from 'react';

import Button from '@atlaskit/button/default/button';
import { Checkbox } from '@atlaskit/checkbox/checkbox';
import { CheckboxField } from '@atlaskit/form/checkbox-field';
import Form from '@atlaskit/form/form';
import { FormFooter } from '@atlaskit/form/form-footer';

export default (): React.JSX.Element => (
	<Form<{ remember: boolean }> onSubmit={() => {}}>
		<CheckboxField name="remember" isRequired>
			{({ fieldProps }) => <Checkbox {...fieldProps} label="Remember me" />}
		</CheckboxField>
		<FormFooter>
			<Button type="submit">Next</Button>
		</FormFooter>
	</Form>
);
