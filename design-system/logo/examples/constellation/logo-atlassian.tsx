/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import { AtlassianIcon, AtlassianLogo } from '../../src';

const tableStyle = css({
	width: '415px',
});

const LogoAtlassian = () => {
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
							<AtlassianLogo appearance="brand" />
						</td>
						<td>
							<AtlassianIcon appearance="brand" />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default LogoAtlassian;
