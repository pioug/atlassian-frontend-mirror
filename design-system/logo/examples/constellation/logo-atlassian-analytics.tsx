/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::749b3a5451aa46e9fbc43cb5ac14f08b>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:examples
 */

/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import { AtlassianAnalyticsIcon, AtlassianAnalyticsLogo } from '@atlaskit/logo';

const tableStyle = css({
	width: '415px',
});

const LogoAtlassianAnalytics = () => {
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
							<AtlassianAnalyticsLogo appearance="brand" />
						</td>
						<td>
							<AtlassianAnalyticsIcon appearance="brand" />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default LogoAtlassianAnalytics;
