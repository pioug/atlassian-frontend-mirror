import React from 'react';

import { render, screen } from '@testing-library/react';

import noop from '@atlaskit/ds-lib/noop';
import SuccessIcon from '@atlaskit/icon/core/status-success';

import Flag from '../../flag';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Flag should be found by data-testid', () => {
	test('Using getByTestId()', async () => {
		render(
			<Flag
				actions={[
					{ content: 'Show me', onClick: noop },
					{ content: 'No thanks', onClick: noop },
				]}
				icon={<SuccessIcon spacing="spacious" label="Info" />}
				description="We got fun an games. We got everything you want honey, we know the names."
				id="1"
				key="1"
				title="Welcome to the jungle"
				testId="MyFlagTestId"
			/>,
		);
		expect(screen.getByTestId('MyFlagTestId')).toBeInTheDocument();
	});
});
describe('Flag actions should be found by data-testid', () => {
	test('Using getByTestId()', async () => {
		render(
			<Flag
				actions={[
					{
						content: 'Show me',
						onClick: noop,
						testId: 'MyFlagActionTestId',
					},
					{ content: 'No thanks', onClick: noop },
				]}
				icon={<SuccessIcon spacing="spacious" label="Info" />}
				description="We got fun an games. We got everything you want honey, we know the names."
				id="1"
				key="1"
				title="Welcome to the jungle"
			/>,
		);
		expect(screen.getByTestId('MyFlagActionTestId')).toBeInTheDocument();
	});
});
describe('Flag icon containers should be found by data-testid', () => {
	test('Using getByTestId()', async () => {
		render(
			<Flag
				icon={<SuccessIcon spacing="spacious" label="Info" />}
				description="We got fun an games. We got everything you want honey, we know the names."
				id="1"
				key="1"
				title="Welcome to the jungle"
				testId="MyFlagTestId"
			/>,
		);
		expect(screen.getByTestId('MyFlagTestId-icon-container')).toBeInTheDocument();
	});
});
describe('Flag descriptions should be found by data-testid', () => {
	test('Using getByTestId()', async () => {
		render(
			<Flag
				description="We got fun an games. We got everything you want honey, we know the names."
				id="1"
				key="1"
				title="Welcome to the jungle"
				testId="MyFlagTestId"
			/>,
		);
		expect(screen.getByTestId('MyFlagTestId-description')).toBeInTheDocument();
	});
});
