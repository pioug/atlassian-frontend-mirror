/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::9045bb081264e6e158ddc6f8d2793c49>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:examples
 */

/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import { GuardDetectIcon, GuardDetectLogo } from '@atlaskit/logo';

const tableStyle = css({
	width: '415px',
});

const LogoGuardDetect = () => {
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
							<GuardDetectLogo appearance="brand" />
						</td>
						<td>
							<GuardDetectIcon appearance="brand" />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default LogoGuardDetect;
