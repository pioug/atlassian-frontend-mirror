import React, { type ReactNode, useContext } from 'react';

import { createIntl, createIntlCache, IntlContext, IntlProvider } from 'react-intl-next';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { Box, xcss } from '@atlaskit/primitives';
import { ufologger } from '@atlaskit/ufo';

interface WrapperProps {
	children: ReactNode;
}

export type messages = { [key: string]: string };

const pageWrapperStyles = xcss({
	marginBottom: 'space.400',
	maxWidth: '700px',
});

const exampleWrapperStyles = xcss({
	padding: 'space.600',
});

// Prevents memory leaks
const cache = createIntlCache();

// Required for VR testing
const useSafeIntl = () => {
	const context = useContext(IntlContext);
	if (!context) {
		return createIntl(
			{
				locale: 'en',
				messages: {},
			},
			cache,
		);
	}
	return context;
};

export function PageWrapper({ children }: WrapperProps) {
	ufologger.enable();
	const intl = useSafeIntl();

	return (
		<SmartCardProvider>
			<Box xcss={[exampleWrapperStyles]}>
				<IntlProvider
					locale={intl.locale}
					// should be remove when ff: platform.linking-platform.link-picker.lazy-intl-messages is cleaned up
					onError={() => {}}
				>
					{children}
				</IntlProvider>
			</Box>
		</SmartCardProvider>
	);
}

export function PageHeader(wrapperProps: WrapperProps) {
	return <Box xcss={[pageWrapperStyles]}>{wrapperProps.children}</Box>;
}
