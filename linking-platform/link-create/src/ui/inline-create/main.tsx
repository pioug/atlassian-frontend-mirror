import React from 'react';

import { Box } from '@atlaskit/primitives/compiled';

import { DEFAULT_TEST_ID, SCREEN_ID } from '../../common/constants';
import type { LinkCreateProps } from '../../common/types';
import { ConfirmDismissDialog } from '../../common/ui/confirm-dismiss-dialog';
import { EditModal } from '../../common/ui/edit-modal';
import { ErrorBoundary } from '../../common/ui/error-boundary';
import { LinkCreateContent } from '../../common/ui/link-create-content';
import { LinkCreateCallbackProvider } from '../../controllers/callback-context';
import {
	EditPostCreateModalProvider,
	useEditPostCreateModal,
} from '../../controllers/edit-post-create-context';
import { useExitWarningModal } from '../../controllers/exit-warning-modal-context';
import { FormContextProvider } from '../../controllers/form-context';
import { LinkCreatePluginsProvider, useLinkCreatePlugins } from '../../controllers/plugin-context';

import { InlineAnalytics } from './inline-analytics';

const InlineCreateContent = ({
	onCreate,
	onFailure,
	onCancel,
	onComplete,
	plugins,
	entityKey,
	testId = DEFAULT_TEST_ID,
}: LinkCreateProps) => {
	const { withExitWarning, showExitWarning, setShowExitWarning } = useExitWarningModal();

	const { editViewPayload } = useEditPostCreateModal();
	const { activePlugin } = useLinkCreatePlugins();

	const handleCloseExitWarning = () => setShowExitWarning(false);

	return (
		<LinkCreateCallbackProvider
			onCreate={onCreate}
			onFailure={onFailure}
			onCancel={withExitWarning(onCancel)}
		>
			<ErrorBoundary>
				<InlineAnalytics screen={SCREEN_ID}>
					<Box testId={testId}>
						<LinkCreateContent plugins={plugins} entityKey={entityKey} />
					</Box>
				</InlineAnalytics>
			</ErrorBoundary>

			{onComplete && (
				<EditModal
					onClose={onComplete}
					editViewPayload={editViewPayload}
					activePlugin={activePlugin}
				/>
			)}

			<ConfirmDismissDialog
				active={showExitWarning}
				onClose={handleCloseExitWarning}
				onCancel={onCancel}
			/>
		</LinkCreateCallbackProvider>
	);
};

const InlineCreate = (props: LinkCreateProps): React.JSX.Element => {
	return (
		<LinkCreatePluginsProvider plugins={props.plugins} entityKey={props.entityKey}>
			{(pluginsProvider) => (
				<EditPostCreateModalProvider active={true}>
					{({ setEditViewPayload, shouldActivateEditView, enableEditView }) => (
						<FormContextProvider
							enableEditView={
								pluginsProvider?.activePlugin?.editView && props?.onComplete
									? enableEditView
									: undefined
							}
						>
							<InlineCreateContent
								{...props}
								onCreate={async (payload) => {
									await props.onCreate?.(payload);

									// if onComplete exists then there is an edit flow
									if (props.onComplete) {
										if (shouldActivateEditView()) {
											//edit button is pressed
											setEditViewPayload(payload);
										} else {
											//create button is pressed
											props.onComplete();
										}
									}
								}}
							/>
						</FormContextProvider>
					)}
				</EditPostCreateModalProvider>
			)}
		</LinkCreatePluginsProvider>
	);
};

export default InlineCreate;
