/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useEffect } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import {
	type NamedPluginStatesFromInjectionAPI,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/hooks';
import { helpDialogMessages as messages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import AkModalDialog, { ModalTransition } from '@atlaskit/modal-dialog';

import type { HelpDialogPlugin } from '../helpDialogPluginType';
import { closeHelpCommand } from '../pm-plugins/commands';

import type { Format } from './Format';
import { getSupportedFormatting } from './formatting';
import Modal from './Modal';

export interface HelpDialogProps {
	editorView: EditorView;
	pluginInjectionApi: ExtractInjectionAPI<HelpDialogPlugin> | undefined;
	quickInsertEnabled?: boolean;
}

const selector = (
	states: NamedPluginStatesFromInjectionAPI<ExtractInjectionAPI<HelpDialogPlugin>, 'helpDialog'>,
) => {
	return {
		isVisible: states.helpDialogState?.isVisible,
		imageEnabled: states.helpDialogState?.imageEnabled,
		aiEnabled: states.helpDialogState?.aiEnabled,
	};
};

const HelpDialog = ({
	pluginInjectionApi,
	editorView,
	quickInsertEnabled,
	intl,
}: HelpDialogProps & WrappedComponentProps) => {
	const { isVisible, imageEnabled, aiEnabled } = useSharedPluginStateWithSelector(
		pluginInjectionApi,
		['helpDialog'],
		selector,
	);

	const closeDialog = useCallback(() => {
		const {
			state: { tr },
			dispatch,
		} = editorView;
		closeHelpCommand(tr, dispatch);
	}, [editorView]);

	const handleEsc = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === 'Escape' && isVisible) {
				closeDialog();
			}
		},
		[closeDialog, isVisible],
	);

	useEffect(() => {
		// Ignored via go/ees005
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		document.addEventListener('keydown', handleEsc);

		return () => {
			// Ignored via go/ees005
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			document.removeEventListener('keydown', handleEsc);
		};
	}, [handleEsc]);

	const formatting: Format[] = getSupportedFormatting(
		editorView.state.schema,
		intl,
		imageEnabled,
		quickInsertEnabled,
		aiEnabled,
	);

	const label = intl.formatMessage(messages.editorHelp);

	return (
		<ModalTransition>
			{isVisible ? (
				<AkModalDialog label={label} width="large" onClose={closeDialog} testId="help-modal-dialog">
					<Modal formatting={formatting} />
				</AkModalDialog>
			) : null}
		</ModalTransition>
	);
};

export default injectIntl(HelpDialog);
