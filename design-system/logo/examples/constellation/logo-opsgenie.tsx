/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import { OpsgenieIcon, OpsgenieLogo } from '@atlaskit/logo';

const tableStyle = css({
	width: '415px',
});

const LogoOpsgenie = () => {
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
							<OpsgenieLogo appearance="brand" />
						</td>
						<td>
							<OpsgenieIcon appearance="brand" />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default LogoOpsgenie;
