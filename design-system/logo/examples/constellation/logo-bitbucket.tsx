/**
 * @jsxRuntime classic
 */
/** @jsx jsx */

import { css, jsx } from '@compiled/react';

import { BitbucketIcon, BitbucketLogo } from '../../src';

const tableStyle = css({
	width: '415px',
});

const LogoBitbucket = () => {
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
							<BitbucketLogo appearance="brand" />
						</td>
						<td>
							<BitbucketIcon appearance="brand" />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default LogoBitbucket;
