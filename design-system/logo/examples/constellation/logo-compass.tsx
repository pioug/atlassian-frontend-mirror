/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import { CompassIcon, CompassLogo } from '@atlaskit/logo';

const tableStyle = css({
	width: '415px',
});

const LogoCompass = () => {
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
							<CompassLogo appearance="brand" />
						</td>
						<td>
							<CompassIcon appearance="brand" />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default LogoCompass;
