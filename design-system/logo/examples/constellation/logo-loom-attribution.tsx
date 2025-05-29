/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::a7374926189f4c9f528b40edf2487bb6>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:examples
 */

/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import { LoomAttributionIcon, LoomAttributionLogo } from '@atlaskit/logo';

const tableStyle = css({
	width: '415px',
});

const LogoLoomAttribution = () => {
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
							<LoomAttributionLogo appearance="brand" />
						</td>
						<td>
							<LoomAttributionIcon appearance="brand" />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default LogoLoomAttribution;
