import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import LinkCreate, { CreateForm, TextField } from '@atlaskit/link-create';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';
const styles = cssMap({
	subject: {
		width: 'fit-content',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: token('space.200'),
	},
});

export default function Preview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<Box testId="component-preview" xcss={styles.subject}>
				<LinkCreate
					active
					entityKey="task"
					triggeredFrom="preview"
					plugins={[
						{
							key: 'task',
							label: 'Task',
							icon: '',
							group: { key: 'project', label: 'Project', icon: '' },
							form: (
								<CreateForm
									hideRequiredFieldMessage
									initialValues={{ title: 'Plan the release' }}
									onSubmit={() => {}}
								>
									<TextField name="title" label="Title" />
								</CreateForm>
							),
						},
					]}
					onCreate={async () => {}}
					onComplete={() => {}}
					onCancel={() => {}}
					onFailure={() => {}}
				/>
			</Box>
		</IntlProvider>
	);
}
