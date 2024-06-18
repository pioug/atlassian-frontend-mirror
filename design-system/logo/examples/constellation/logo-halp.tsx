/**
 * @jsxRuntime classic
 */
/** @jsx jsx */

import { css, jsx } from '@compiled/react';

import { HalpIcon, HalpLogo } from '../../src';

const tableStyle = css({
	width: '415px',
});

const LogoHalp = () => (
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
						<HalpLogo appearance="brand" />
					</td>
					<td>
						<HalpIcon appearance="brand" />
					</td>
				</tr>
			</tbody>
		</table>
	</div>
);

export default LogoHalp;
