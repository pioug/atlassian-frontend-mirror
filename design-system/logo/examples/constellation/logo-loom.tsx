/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::4d23321350c600146a52e1f93cf148b6>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:examples
 */

/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import { LoomIcon, LoomLogo } from '@atlaskit/logo';

const tableStyle = css({
	width: '415px',
});

const LogoLoom = () => {
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
							<LoomLogo appearance="brand" />
						</td>
						<td>
							<LoomIcon appearance="brand" />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default LogoLoom;
