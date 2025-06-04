/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::5695cbe023586d7e6a90a35d986e6fc6>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:examples
 */

/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import { HubIcon, HubLogo } from '@atlaskit/logo';

const tableStyle = css({
	width: '415px',
});

const LogoHub = () => {
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
							<HubLogo appearance="brand" />
						</td>
						<td>
							<HubIcon appearance="brand" />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default LogoHub;
