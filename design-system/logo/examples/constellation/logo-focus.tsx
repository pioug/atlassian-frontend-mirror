/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import { FocusIcon, FocusLogo } from '@atlaskit/logo';

const tableStyle = css({
	width: '415px',
});

const LogoFocus = () => {
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
							<FocusLogo appearance="brand" />
						</td>
						<td>
							<FocusIcon appearance="brand" />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default LogoFocus;
