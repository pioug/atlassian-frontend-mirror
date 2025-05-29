/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::4b97f6afd14a14a17e2739feb00fbc49>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:examples
 */

/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import { TrelloIcon, TrelloLogo } from '@atlaskit/logo';

const tableStyle = css({
	width: '415px',
});

const LogoTrello = () => {
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
							<TrelloLogo appearance="brand" />
						</td>
						<td>
							<TrelloIcon appearance="brand" />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default LogoTrello;
