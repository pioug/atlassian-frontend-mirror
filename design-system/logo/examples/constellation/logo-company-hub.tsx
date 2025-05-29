/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::d7be5dc19f630e7bd4da4e98a1d6a47f>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:examples
 */

/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import { CompanyHubIcon, CompanyHubLogo } from '@atlaskit/logo';

const tableStyle = css({
	width: '415px',
});

const LogoCompanyHub = () => {
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
							<CompanyHubLogo appearance="brand" />
						</td>
						<td>
							<CompanyHubIcon appearance="brand" />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default LogoCompanyHub;
