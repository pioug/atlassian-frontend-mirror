/** @jsx jsx */

import { css, jsx } from '@compiled/react';

import { JiraIcon, JiraLogo } from '../../src';

const tableStyle = css({
	width: '415px',
});

const LogoJira = () => {
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
							<JiraLogo appearance="brand" />
						</td>
						<td>
							<JiraIcon appearance="brand" />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default LogoJira;
