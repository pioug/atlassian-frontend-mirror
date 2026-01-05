import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { SmartCardProvider } from '@atlaskit/link-provider';

import { SmartLinkStatus } from '../../constants';
import { FlexibleCardContext } from '../../state/flexible-ui-context';
import type { FlexibleUiDataContext } from '../../state/flexible-ui-context/types';
import type { InternalFlexibleUiOptions } from '../../view/FlexibleCard/types';

export const getCardTestWrapper =
	(): React.JSXElementConstructor<{ children: React.ReactNode }> =>
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
	): React.JSXElementConstructor<{ children: React.ReactNode }> =>
	({ children }) => {
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
	};
