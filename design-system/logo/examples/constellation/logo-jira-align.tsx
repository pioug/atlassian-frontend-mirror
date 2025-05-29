/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::c2dfacd53129bb3ac86d0ce7a66510d1>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:examples
 */

/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import { JiraAlignIcon, JiraAlignLogo } from '@atlaskit/logo';

const tableStyle = css({
	width: '415px',
});

const LogoJiraAlign = () => {
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
							<JiraAlignLogo appearance="brand" />
						</td>
						<td>
							<JiraAlignIcon appearance="brand" />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default LogoJiraAlign;
