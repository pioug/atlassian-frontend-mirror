/** @jsx jsx */

import { css, jsx } from '@compiled/react';

import { AtlassianAdminIcon, AtlassianAdminLogo } from '../../src';

const tableStyle = css({
	width: '415px',
});

const LogoAtlassianAdmin = () => {
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
							<AtlassianAdminLogo appearance="brand" />
						</td>
						<td>
							<AtlassianAdminIcon appearance="brand" />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default LogoAtlassianAdmin;
