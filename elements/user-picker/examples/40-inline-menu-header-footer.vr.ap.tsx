import React from 'react';

import Button from '@atlaskit/button/default/button';

import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
import { UserPicker } from '../src/components/UserPicker';

/**
 * An open user picker in inline mode, with a header and a footer. Inline mode keeps the user
 * picker Menu, so the header and the footer show around the options.
 */
const Example = (): React.JSX.Element => (
	<ExampleWrapper>
		{({ options, onInputChange }) => (
			<UserPicker
				fieldId="example"
				open
				menuRenderMode="inline"
				onInputChange={onInputChange}
				options={options}
				placeholder="Inline menu with a header and a footer"
				header={
					<div>
						<h3>Menu header</h3>
					</div>
				}
				footer={
					<div>
						<Button appearance="primary">Menu footer</Button>
					</div>
				}
			/>
		)}
	</ExampleWrapper>
);

export default Example;
