/**
 * @jsxRuntime classic
 */
/** @jsx jsx */

import { css, jsx } from '@compiled/react';

import { StatuspageIcon, StatuspageLogo } from '../../src';

const tableStyle = css({
	width: '415px',
});

const LogoStatusPage = () => {
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
							<StatuspageLogo appearance="brand" />
						</td>
						<td>
							<StatuspageIcon appearance="brand" />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default LogoStatusPage;
