import React, { type ReactNode } from 'react';

import { IntlProvider } from 'react-intl';

import { FeatureFlagsWrapper } from '@atlaskit/media-test-helpers';

import { UfoLoggerWrapper } from './UfoWrapper';

export const MainWrapper = ({ children }: { children: ReactNode }): React.JSX.Element => (
	<UfoLoggerWrapper>
		<FeatureFlagsWrapper>
			<IntlProvider locale={'en'}>{children}</IntlProvider>
		</FeatureFlagsWrapper>
	</UfoLoggerWrapper>
);
