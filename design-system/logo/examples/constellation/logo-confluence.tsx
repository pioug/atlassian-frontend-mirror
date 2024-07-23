/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import { ConfluenceIcon, ConfluenceLogo } from '../../src';

const tableStyle = css({
	width: '415px',
});

const LogoConfluence = () => {
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
							<ConfluenceLogo appearance="brand" />
						</td>
						<td>
							<ConfluenceIcon appearance="brand" />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default LogoConfluence;
