/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::d353e7f0d2cb4205f8cca4fa05344a84>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:examples
 */

/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import { JiraProductDiscoveryIcon, JiraProductDiscoveryLogo } from '@atlaskit/logo';

const tableStyle = css({
	width: '415px',
});

const LogoJiraProductDiscovery = () => {
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
							<JiraProductDiscoveryLogo appearance="brand" />
						</td>
						<td>
							<JiraProductDiscoveryIcon appearance="brand" />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default LogoJiraProductDiscovery;
