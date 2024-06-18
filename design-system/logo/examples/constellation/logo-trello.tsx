/**
 * @jsxRuntime classic
 */
/** @jsx jsx */

import { css, jsx } from '@compiled/react';

import { TrelloIcon, TrelloLogo } from '../../src';

const tableStyle = css({
	width: '415px',
});

const LogoTrello = () => {
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
							<TrelloLogo appearance="brand" />
						</td>
						<td>
							<TrelloIcon appearance="brand" />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default LogoTrello;
