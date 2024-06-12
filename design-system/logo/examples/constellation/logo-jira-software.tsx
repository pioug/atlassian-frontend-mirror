/** @jsx jsx */

import { css, jsx } from '@compiled/react';

import { JiraSoftwareIcon, JiraSoftwareLogo } from '../../src';

const tableStyle = css({
	width: '415px',
});

const LogoJiraSoftware = () => {
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
							<JiraSoftwareLogo appearance="brand" />
						</td>
						<td>
							<JiraSoftwareIcon appearance="brand" />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default LogoJiraSoftware;
