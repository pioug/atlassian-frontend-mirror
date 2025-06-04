/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::273908cd135ebdeb0d030c1d9935763b>>
 * @codegenCommand yarn workspace @atlaskit/logo generate:examples
 */

/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import { CustomerServiceManagementIcon, CustomerServiceManagementLogo } from '@atlaskit/logo';

const tableStyle = css({
	width: '415px',
});

const LogoCustomerServiceManagement = () => {
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
							<CustomerServiceManagementLogo appearance="brand" />
						</td>
						<td>
							<CustomerServiceManagementIcon appearance="brand" />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default LogoCustomerServiceManagement;
