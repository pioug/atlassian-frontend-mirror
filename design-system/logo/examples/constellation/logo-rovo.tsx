/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import { RovoIcon, RovoLogo } from '../../src';

const tableStyle = css({
	width: '415px',
});

const LogoRovo = () => {
	return (
		<div>
			<table>
				<thead>
					<tr>
						<th>Logo</th>
						<th>Icon</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td css={tableStyle}>
							<RovoLogo appearance="brand" />
						</td>
						<td>
							<RovoIcon appearance="brand" />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default LogoRovo;
