/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode, useContext } from 'react';

import { createIntl, createIntlCache, IntlContext, IntlProvider } from 'react-intl-next';

import { cssMap, jsx } from '@atlaskit/css';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import { ufologger } from '@atlaskit/ufo';

const styles = cssMap({
	pageWrapper: {
		marginBottom: token('space.400'),
		maxWidth: '700px',
	},
	exampleWrapper: {
		paddingTop: token('space.600'),
		paddingRight: token('space.600'),
		paddingBottom: token('space.600'),
		paddingLeft: token('space.600'),
	},
});

interface WrapperProps {
	children: ReactNode;
}

export type messages = { [key: string]: string };

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
			<Box xcss={styles.exampleWrapper}>
				<IntlProvider locale={intl.locale}>{children}</IntlProvider>
			</Box>
		</SmartCardProvider>
	);
}

export function PageHeader(wrapperProps: WrapperProps) {
	return <Box xcss={styles.pageWrapper}>{wrapperProps.children}</Box>;
}
