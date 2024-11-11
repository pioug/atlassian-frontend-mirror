/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import { AtlassianMarketplaceIcon, AtlassianMarketplaceLogo } from '@atlaskit/logo';

const tableStyle = css({
	width: '415px',
});

const LogoAtlassianMarketplace = () => {
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
							<AtlassianMarketplaceLogo appearance="brand" />
						</td>
						<td>
							<AtlassianMarketplaceIcon appearance="brand" />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default LogoAtlassianMarketplace;
