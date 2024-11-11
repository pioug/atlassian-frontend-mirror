/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import { JiraProductDiscoveryIcon, JiraProductDiscoveryLogo } from '@atlaskit/logo';

const tableStyle = css({
	width: '415px',
});

const LogoJiraProductDiscovery = () => {
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
							<JiraProductDiscoveryLogo appearance="brand" />
						</td>
						<td>
							<JiraProductDiscoveryIcon appearance="brand" />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default LogoJiraProductDiscovery;
