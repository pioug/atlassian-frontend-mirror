import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { fg } from '@atlaskit/platform-feature-flags';

import { SmartLinkStatus } from '../../constants';
import {
	FlexibleCardContext,
	FlexibleUiContext,
	FlexibleUiOptionContext,
} from '../../state/flexible-ui-context';
import type { FlexibleUiDataContext } from '../../state/flexible-ui-context/types';
import type { InternalFlexibleUiOptions } from '../../view/FlexibleCard/types';

export const getCardTestWrapper =
	(): React.JSXElementConstructor<{ children: React.ReactElement }> =>
	({ children }) => (
		<IntlProvider locale="en">
			<SmartCardProvider>{children}</SmartCardProvider>
		</IntlProvider>
	);

export const getFlexibleCardTestWrapper =
	(
		data?: FlexibleUiDataContext,
		ui?: InternalFlexibleUiOptions,
		status?: SmartLinkStatus,
	): React.JSXElementConstructor<{ children: React.ReactElement }> =>
	({ children }) => {
		if (fg('platform-linking-flexible-card-context')) {
			return (
				<IntlProvider locale="en">
					<SmartCardProvider>
						<FlexibleCardContext.Provider
							value={{ data, status: status ?? SmartLinkStatus.Resolved, ui }}
						>
							{children}
						</FlexibleCardContext.Provider>
					</SmartCardProvider>
				</IntlProvider>
			);
		}

		return (
			<IntlProvider locale="en">
				<SmartCardProvider>
					<FlexibleUiOptionContext.Provider value={ui}>
						<FlexibleUiContext.Provider value={data}>{children}</FlexibleUiContext.Provider>
					</FlexibleUiOptionContext.Provider>
				</SmartCardProvider>
			</IntlProvider>
		);
	};
