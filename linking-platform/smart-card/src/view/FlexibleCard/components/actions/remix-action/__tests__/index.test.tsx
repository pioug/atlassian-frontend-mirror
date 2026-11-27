import '@atlaskit/link-test-helpers/jest';
import React from 'react';

import { IntlProvider } from 'react-intl';

import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';
import { userEvent } from '@atlassian/testing-library/user-event';

import mockContext from '../../../../../../__fixtures__/flexible-ui-data-context';
import { InternalActionName, SmartLinkStatus } from '../../../../../../constants';
import { FlexibleCardContext } from '../../../../../../state/flexible-ui-context';
import type { FlexibleUiDataContext } from '../../../../../../state/flexible-ui-context/types';
import * as useInvokeClientAction from '../../../../../../state/hooks/use-invoke-client-action';
import RemixAction from '../index';

const mockOpenRemix = jest.fn();
jest.mock('@atlaskit/link-provider/use-plugins', () => ({
	usePlugins: () => ({ remix: { isAvailable: () => true, open: mockOpenRemix } }),
}));

const remixUrl = 'https://docs.google.com/spreadsheets/d/remix';
const data: FlexibleUiDataContext = {
	...mockContext,
	actions: {
		...mockContext.actions,
		[InternalActionName.RemixAction]: {
			invokeAction: {
				actionSubjectId: 'remix',
				actionType: InternalActionName.RemixAction,
				definitionId: 'd1',
				display: 'block',
				extensionKey: 'google-object-provider',
				id: 'uid',
				resourceType: 'r1',
			},
			url: remixUrl,
		},
	},
};

const setup = (props?: Partial<React.ComponentProps<typeof RemixAction>>) =>
	render(
		<FlexibleCardContext.Provider value={{ data, status: SmartLinkStatus.Resolved }}>
			<IntlProvider locale="en">
				<RemixAction {...props} />
			</IntlProvider>
		</FlexibleCardContext.Provider>,
	);

describe('RemixAction', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('renders the Remix action', () => {
		setup();

		expect(screen.getByRole('button', { name: 'Remix' })).toBeInTheDocument();
	});

	it('opens Remix through invokeAction without prompt analytics data', async () => {
		const invoke = jest.fn(({ actionFn }) => actionFn());
		jest.spyOn(useInvokeClientAction, 'default').mockReturnValue(invoke);
		const onClick = jest.fn();

		setup({ onClick });
		await userEvent.setup().click(screen.getByRole('button', { name: 'Remix' }));

		expect(mockOpenRemix).toHaveBeenCalledWith({ url: remixUrl });
		expect(onClick).toHaveBeenCalledTimes(1);
		expect(invoke).toHaveBeenCalledWith({
			actionFn: expect.any(Function),
			actionSubjectId: 'remix',
			actionType: InternalActionName.RemixAction,
			definitionId: 'd1',
			display: 'block',
			extensionKey: 'google-object-provider',
			id: 'uid',
			resourceType: 'r1',
		});
		expect(invoke.mock.calls[0][0]).not.toHaveProperty('prompt');
	});

	it('does not render without Remix action data', () => {
		render(
			<FlexibleCardContext.Provider
				value={{
					data: {
						...mockContext,
						actions: { ...mockContext.actions, [InternalActionName.RemixAction]: undefined },
					},
					status: SmartLinkStatus.Resolved,
				}}
			>
				<IntlProvider locale="en">
					<RemixAction />
				</IntlProvider>
			</FlexibleCardContext.Provider>,
		);

		expect(screen.queryByRole('button', { name: 'Remix' })).not.toBeInTheDocument();
	});
});
