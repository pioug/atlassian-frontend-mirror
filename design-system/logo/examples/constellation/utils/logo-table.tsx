/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

const tableStyle = css({
	width: '415px',
});

const LogoTable = ({ Logo, Icon }: { Logo: React.ReactNode; Icon: React.ReactNode }) => {
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
						<td css={tableStyle}>{Logo}</td>
						<td>{Icon}</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default LogoTable;
