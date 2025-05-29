/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::1f3cf226498d168a1ba127fb86f0342f>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:examples
 */

/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import { OpsgenieIcon, OpsgenieLogo } from '@atlaskit/logo';

const tableStyle = css({
	width: '415px',
});

const LogoOpsgenie = () => {
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
							<OpsgenieLogo appearance="brand" />
						</td>
						<td>
							<OpsgenieIcon appearance="brand" />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default LogoOpsgenie;
