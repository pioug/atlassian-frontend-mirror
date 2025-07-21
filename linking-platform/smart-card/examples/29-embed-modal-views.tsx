import React from 'react';

import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';

import Heading from '@atlaskit/heading';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';

import { ActionName, IconType } from '../src/constants';
import { StopPropagation } from '../src/view/common/stop-propagation';
import EmbedModal from '../src/view/EmbedModal';
import { PreviewAction } from '../src/view/FlexibleCard/components/actions';

import ExampleContainer from './content/example-container';
import { overrideEmbedContent } from './utils/common';

const containerStyles = xcss({
	display: 'flex',
	flexDirection: 'column',
	gap: 'space.600',
	padding: 'space.600',
});

export default () => {
	const [element, setElement] = React.useState<React.ReactNode | React.ReactElement>(null);

	const openEmbedModal = () =>
		setElement(
			<React.Suspense fallback={null}>
				<StopPropagation>
					<EmbedModal
						invokeDownloadAction={{
							actionFn: async () => {},

							actionType: ActionName.DownloadAction,
						}}
						invokeViewAction={{
							actionFn: async () => {},

							actionType: ActionName.PreviewAction,
						}}
						linkIcon={{ icon: IconType.Jira }}
						iframeName="iframe-name"
						onClose={() => setElement(null)}
						providerName="Nowhere"
						showModal
						src={overrideEmbedContent}
						title="This is an example for EmbedModal"
						testId="vr-test"
						url="https://link-url"
					/>
				</StopPropagation>
			</React.Suspense>,
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
				<Heading size="medium">Preview Action & EmbedModal</Heading>

				<PreviewAction as="button" onClick={openEmbedModal} />

				<ErrorBoundary fallbackRender={fallbackRender} onReset={onReset}>
					{element}
				</ErrorBoundary>
			</Box>
		</ExampleContainer>
	);
};
