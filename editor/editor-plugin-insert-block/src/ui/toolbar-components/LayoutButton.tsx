import React from 'react';

import { useIntl } from 'react-intl';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics/types/enums';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages/insert-block';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar/context';
import { TOOLBAR_BUTTON_TEST_ID } from '@atlaskit/editor-common/toolbar/keys';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import { LayoutIcon } from '@atlaskit/editor-toolbar/layout-icon';
import { ToolbarButton } from '@atlaskit/editor-toolbar/toolbar-button';
import { ToolbarTooltip } from '@atlaskit/editor-toolbar/toolbar-tooltip';

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
