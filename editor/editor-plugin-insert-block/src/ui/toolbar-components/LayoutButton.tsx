import React from 'react';

import { useIntl } from 'react-intl-next';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { useEditorToolbar, TOOLBAR_BUTTON_TEST_ID } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarButton, ToolbarTooltip, LayoutIcon } from '@atlaskit/editor-toolbar';

import type { InsertBlockPlugin } from '../../insertBlockPluginType';

type LayoutButtonProps = {
	api?: ExtractInjectionAPI<InsertBlockPlugin>;
};

export const LayoutButton = ({ api }: LayoutButtonProps): React.JSX.Element | null => {
	const { formatMessage } = useIntl();
	const { editorView } = useEditorToolbar();

	if (!api?.layout) {
		return null;
	}

	const onClick = () => {
		if (editorView) {
			const { state, dispatch } = editorView;
			api?.layout?.actions.insertLayoutColumns(INPUT_METHOD.TOOLBAR)(state, dispatch);
		}
	};

	return (
		<ToolbarTooltip content={formatMessage(messages.columns)}>
			<ToolbarButton
				iconBefore={<LayoutIcon label={formatMessage(messages.columns)} size="small" />}
				onClick={onClick}
				testId={TOOLBAR_BUTTON_TEST_ID.LAYOUT}
			/>
		</ToolbarTooltip>
	);
};
