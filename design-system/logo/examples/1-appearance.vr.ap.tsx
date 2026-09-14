import React from 'react';

import { Box } from '@atlaskit/primitives/compiled';

import { appearances, logosAndIcons } from './utils/list';

export default (): React.JSX.Element => (
	<div>
		{logosAndIcons.map(({ name, logo: Logo, icon: Icon }) => (
			<table key={name}>
				<caption>{name}</caption>
				<thead>
					<tr>
						<th>Appearance</th>
						<th>Logo</th>
						<th>Icon</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Default</td>
						<td>
							<Logo />
						</td>
						<td>
							<Icon />
						</td>
					</tr>
					<tr>
						<td>Custom colors</td>
						<td>
							<Logo textColor={'#FF5630'} iconColor={'#6554C0'} />
						</td>
						<td>
							<Icon textColor={'#FF5630'} iconColor={'#6554C0'} />
						</td>
					</tr>
					{appearances.map((appearance) => (
						<tr key={appearance}>
							<td>Appearance {appearance}</td>
							<Box
								as="td"
								backgroundColor={
									appearance === 'inverse' ? 'color.background.brand.bold' : undefined
								}
							>
								<Logo appearance={appearance} />
							</Box>
							<Box
								as="td"
								backgroundColor={
									appearance === 'inverse' ? 'color.background.brand.bold' : undefined
								}
							>
								<Icon appearance={appearance} />
							</Box>
						</tr>
					))}
				</tbody>
			</table>
		))}
	</div>
);
