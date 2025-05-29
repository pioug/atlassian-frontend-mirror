/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::2a6dc40b7d5ddeb44c6266627cc46222>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:examples
 */

/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import { AtlassianAdministrationIcon, AtlassianAdministrationLogo } from '@atlaskit/logo';

const tableStyle = css({
	width: '415px',
});

const LogoAtlassianAdministration = () => {
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
							<AtlassianAdministrationLogo appearance="brand" />
						</td>
						<td>
							<AtlassianAdministrationIcon appearance="brand" />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default LogoAtlassianAdministration;
