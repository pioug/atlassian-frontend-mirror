import React from 'react';

import { cssMap } from '@compiled/react';

import Button from '@atlaskit/button/new';
import Form, { Field, FormFooter, FormHeader, RequiredAsterisk } from '@atlaskit/form';
import { Flex } from '@atlaskit/primitives/compiled';
import TextField from '@atlaskit/textfield';

const styles = cssMap({
	flex: {
		width: '400px',
		maxWidth: '100%',
		margin: '0 auto',
	},
});

export default () => (
	<Flex xcss={styles.flex} direction="column">
		<Form onSubmit={(data) => console.log(data)}>
			{({ formProps }) => (
				<form {...formProps} name="text-fields">
					<FormHeader title="Enter your name">
						<p aria-hidden="true">
							Required fields are marked with an asterisk <RequiredAsterisk />
						</p>
					</FormHeader>
					<Field name="firstname" defaultValue="" label="First name" isRequired>
						{({ fieldProps }) => <TextField autoComplete="given-name" {...fieldProps} />}
					</Field>
					<FormFooter align="start">
						<Button type="submit" appearance="primary">
							Submit
						</Button>
					</FormFooter>
				</form>
			)}
		</Form>
	</Flex>
);
