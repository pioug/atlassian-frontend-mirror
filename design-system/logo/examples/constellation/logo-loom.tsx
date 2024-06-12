/** @jsx jsx */

import { css, jsx } from '@compiled/react';

import { LoomIcon, LoomLogo } from '../../src';

const tableStyle = css({
	width: '415px',
});

const LogoLoom = () => {
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
							<LoomLogo appearance="brand" />
						</td>
						<td>
							<LoomIcon appearance="brand" />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default LogoLoom;
