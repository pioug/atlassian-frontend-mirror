/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import { GuardIcon, GuardLogo } from '../../src';

const tableStyle = css({
	width: '415px',
});

const LogoGuard = () => {
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
							<GuardLogo appearance="brand" />
						</td>
						<td>
							<GuardIcon appearance="brand" />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default LogoGuard;
