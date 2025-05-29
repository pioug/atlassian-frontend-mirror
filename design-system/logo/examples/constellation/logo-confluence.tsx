/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::603cd26fdb6f3b0d65bfc7e30f4e98b1>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:examples
 */

/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import { ConfluenceIcon, ConfluenceLogo } from '@atlaskit/logo';

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
