import React from 'react';

import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';

import Heading from '@atlaskit/heading';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';

import { SmartLinkModalContext } from '../src/state/modal';
import type { SmartLinkModalAPI } from '../src/state/modal/types';
import { StopPropagation } from '../src/view/common/stop-propagation';
import { AutomationAction } from '../src/view/FlexibleCard/components/actions';

import ExampleContainer from './content/example-container';

const containerStyles = xcss({
	display: 'flex',
	flexDirection: 'column',
	gap: 'space.600',
	padding: 'space.600',
});

export default (): React.JSX.Element => {
	const [element, setElement] = React.useState<React.ReactNode | React.ReactElement>(null);

	const api: SmartLinkModalAPI = React.useMemo(
		() => ({
			open: (modal) =>
				setElement(
					<React.Suspense fallback={null}>
						<StopPropagation>{modal}</StopPropagation>
					</React.Suspense>,
				),
			close: () => setElement(null),
		}),
		[],
	);

	const fallbackRender = React.useCallback(
		({ resetErrorBoundary }: { resetErrorBoundary: FallbackProps['resetErrorBoundary'] }) => {
			resetErrorBoundary();
			return null;
		},
		[],
	);

	const onReset = React.useCallback(() => setElement(null), []);

	return (
		<ExampleContainer>
			<Box xcss={containerStyles}>
				<Heading size="medium">Automation Action & Modal</Heading>
				<SmartLinkModalContext.Provider value={api}>
					<AutomationAction as="button" />
				</SmartLinkModalContext.Provider>

				<ErrorBoundary fallbackRender={fallbackRender} onReset={onReset}>
					{element}
				</ErrorBoundary>
			</Box>
		</ExampleContainer>
	);
};
