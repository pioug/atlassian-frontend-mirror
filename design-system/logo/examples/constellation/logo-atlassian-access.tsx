/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import { AtlassianAccessIcon, AtlassianAccessLogo } from '../../src';

const tableStyle = css({
	width: '415px',
});

const LogoAtlassianAccess = () => {
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
							<AtlassianAccessLogo appearance="brand" />
						</td>
						<td>
							<AtlassianAccessIcon appearance="brand" />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default LogoAtlassianAccess;
