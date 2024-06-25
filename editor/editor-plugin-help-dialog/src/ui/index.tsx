/** @jsx jsx */
import { useCallback, useEffect } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import AkModalDialog, { ModalTransition } from '@atlaskit/modal-dialog';

import { closeHelpCommand } from '../commands';
import type { HelpDialogPlugin } from '../types';

import type { Format } from './Format';
import { getSupportedFormatting } from './formatting';
import Modal from './Modal';

export interface HelpDialogProps {
	pluginInjectionApi: ExtractInjectionAPI<HelpDialogPlugin> | undefined;
	editorView: EditorView;
	quickInsertEnabled?: boolean;
}

const HelpDialog = ({
	pluginInjectionApi,
	editorView,
	quickInsertEnabled,
	intl,
}: HelpDialogProps & WrappedComponentProps) => {
	const { helpDialogState } = useSharedPluginState(pluginInjectionApi, ['helpDialog']);

	const closeDialog = useCallback(() => {
		const {
			state: { tr },
			dispatch,
		} = editorView;
		closeHelpCommand(tr, dispatch);
	}, [editorView]);

	const handleEsc = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === 'Escape' && helpDialogState?.isVisible) {
				closeDialog();
			}
		},
		[closeDialog, helpDialogState?.isVisible],
	);

	useEffect(() => {
		document.addEventListener('keydown', handleEsc);

		return () => {
			document.removeEventListener('keydown', handleEsc);
		};
	}, [handleEsc]);

	const formatting: Format[] = getSupportedFormatting(
		editorView.state.schema,
		intl,
		helpDialogState?.imageEnabled,
		quickInsertEnabled,
	);

	return (
		<ModalTransition>
			{helpDialogState?.isVisible ? (
				<AkModalDialog width="large" onClose={closeDialog} testId="help-modal-dialog">
					<Modal formatting={formatting} />
				</AkModalDialog>
			) : null}
		</ModalTransition>
	);
};

export default injectIntl(HelpDialog);
