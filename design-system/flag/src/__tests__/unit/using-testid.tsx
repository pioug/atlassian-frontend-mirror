import React from 'react';

import { render } from '@testing-library/react';

import noop from '@atlaskit/ds-lib/noop';
import SuccessIcon from '@atlaskit/icon/glyph/check-circle';

import Flag from '../../flag';

describe('Flag should be found by data-testid', () => {
	test('Using getByTestId()', async () => {
		const { getByTestId } = render(
			<Flag
				actions={[
					{ content: 'Show me', onClick: noop },
					{ content: 'No thanks', onClick: noop },
				]}
				icon={<SuccessIcon label="Info" />}
				description="We got fun an games. We got everything you want honey, we know the names."
				id="1"
				key="1"
				title="Welcome to the jungle"
				testId="MyFlagTestId"
			/>,
		);
		expect(getByTestId('MyFlagTestId')).toBeTruthy();
	});
});
describe('Flag actions should be found by data-testid', () => {
	test('Using getByTestId()', async () => {
		const { getByTestId } = render(
			<Flag
				actions={[
					{
						content: 'Show me',
						onClick: noop,
						testId: 'MyFlagActionTestId',
					},
					{ content: 'No thanks', onClick: noop },
				]}
				icon={<SuccessIcon label="Info" />}
				description="We got fun an games. We got everything you want honey, we know the names."
				id="1"
				key="1"
				title="Welcome to the jungle"
			/>,
		);
		expect(getByTestId('MyFlagActionTestId')).toBeTruthy();
	});
});
