/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import { JiraServiceManagementIcon, JiraServiceManagementLogo } from '@atlaskit/logo';

const tableStyle = css({
	width: '415px',
});

const LogoJiraServiceManagement = () => {
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
							<JiraServiceManagementLogo appearance="brand" />
						</td>
						<td>
							<JiraServiceManagementIcon appearance="brand" />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default LogoJiraServiceManagement;
