/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

const tableStyle = css({
	width: '415px',
});

const LogoTable = ({
	logo: Logo,
	icon: Icon,
}: {
	logo: React.ReactNode | React.ReactNode[];
	icon: React.ReactNode | React.ReactNode[];
}) => {
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
							{Array.isArray(Logo)
								? Logo.map((logo, index) => <div key={index}>{logo}</div>)
								: Logo}
						</td>
						<td>
							{Array.isArray(Icon)
								? Icon.map((icon, index) => <div key={index}>{icon}</div>)
								: Icon}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default LogoTable;
