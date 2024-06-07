import { token } from '@atlaskit/tokens';
import React, { useState } from 'react';
import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
import UserPicker from '../src';

const Example = () => {
	const [enableRandomFailures, setEnableRandomFailures] = useState(false);
	return (
		<ExampleWrapper>
			{({ loadUsers }) => (
				<div
					style={{
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						display: 'grid',
						gridGap: `${token('space.200', '16px')}`,
						padding: `${token('space.200', '16px')}`,
					}}
				>
					<div>
						<p>Async load options</p>
						<UserPicker
							fieldId="user-picker-async-load-options"
							onChange={console.log}
							loadOptions={loadUsers}
						/>
					</div>

					<div>
						<p>Async load options that fails</p>
						<input
							checked={enableRandomFailures}
							id="enableRandomFailures"
							onChange={(e) => {
								setEnableRandomFailures(!enableRandomFailures);
							}}
							type="checkbox"
						/>
						<label htmlFor="enableRandomFailures">Enable random loadOptions failures</label>
						<UserPicker
							fieldId="user-picker-async-load-options-error"
							onChange={console.log}
							loadOptions={() => {
								return new Promise((resolve, reject) => {
									window.setTimeout(() => {
										if (enableRandomFailures) {
											if (Math.random() > 0.5) {
												return reject('Error');
											}
											return resolve([]);
										}
										return reject('Error');
									}, 400);
								});
							}}
						/>
					</div>
				</div>
			)}
		</ExampleWrapper>
	);
};
export default Example;
