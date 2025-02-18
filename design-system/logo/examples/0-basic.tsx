import React from 'react';

import kebabCase from 'lodash/kebabCase';

import { logosAndIcons } from './utils/list';

export default () => (
	<div>
		<table>
			<thead>
				<tr>
					<th>Logo</th>
					<th>Icon</th>
				</tr>
			</thead>
			<tbody>
				{logosAndIcons.map(({ name, logo: Logo, icon: Icon }) => {
					const kebabName = kebabCase(name);

					return (
						<tr key={name}>
							<td>
								<Logo testId={`${kebabName}-logo`} />
							</td>
							<td>
								<Icon testId={`${kebabName}-icon`} />
							</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	</div>
);
