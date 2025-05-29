/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::6e2bb757a6f01680355490531fd6d7de>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:examples
 */

/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import { GuardIcon, GuardLogo } from '@atlaskit/logo';

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
