/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment } from 'react';

import Avatar from '@atlaskit/avatar';
import { cssMap, jsx } from '@atlaskit/css';
import Form, { Field } from '@atlaskit/form';
import ErrorIcon from '@atlaskit/icon/core/status-error';
import { Box } from '@atlaskit/primitives/compiled';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

const elemStyles = cssMap({
	before: {
		paddingInlineStart: token('space.075'),
	},
	after: {
		paddingInlineEnd: token('space.075'),
	},
});

export default function TextFieldElementsBeforeAndAfterExample() {
	return (
		<Form
			onSubmit={(formData) => console.log('form data', formData)}
			name="elements-before-and-after-example"
		>
			<Field label="After input" name="after-input" defaultValue="">
				{({ fieldProps }: any) => (
					<Fragment>
						<Textfield
							{...fieldProps}
							elemAfterInput={
								<Box xcss={elemStyles.after}>
									<ErrorIcon label="error" />
								</Box>
							}
						/>
					</Fragment>
				)}
			</Field>
			<Field label="Before input" name="before-input" defaultValue="">
				{({ fieldProps }: any) => (
					<Fragment>
						<Textfield
							{...fieldProps}
							elemBeforeInput={
								<Box xcss={elemStyles.before}>
									<Avatar size="small" borderColor="transparent" />
								</Box>
							}
						/>
					</Fragment>
				)}
			</Field>
		</Form>
	);
}
