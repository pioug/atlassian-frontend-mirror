import React from 'react';

import { useIntl } from 'react-intl-next';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { blockMenuMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import AngleBracketsIcon from '@atlaskit/icon/core/angle-brackets';

import type { CodeBlockPlugin } from '../codeBlockPluginType';

type Props = {
	api: ExtractInjectionAPI<CodeBlockPlugin> | undefined;
};

const nodeName = 'codeBlock';

const CodeBlockMenuItem = ({ api }: Props) => {
	const { formatMessage } = useIntl();

	const handleClick = (event: React.MouseEvent | React.KeyboardEvent) => {
		const triggeredFrom =
			event.nativeEvent instanceof KeyboardEvent || event.nativeEvent.detail === 0
				? INPUT_METHOD.KEYBOARD
				: INPUT_METHOD.MOUSE;
		const inputMethod = INPUT_METHOD.BLOCK_MENU;

		api?.core.actions.execute(({ tr }) => {
			const command = api?.blockMenu?.commands.transformNode(tr.doc.type.schema.nodes.codeBlock, {
				inputMethod,
				triggeredFrom,
				targetTypeName: nodeName,
			});
			return command ? command({ tr }) : null;
		});
	};

	const isTransfromToPanelDisabled = api?.blockMenu?.actions.isTransformOptionDisabled(nodeName);
	if (isTransfromToPanelDisabled) {
		return null;
	}

	return (
		<ToolbarDropdownItem onClick={handleClick} elemBefore={<AngleBracketsIcon label="" />}>
			{formatMessage(blockMenuMessages.codeBlock)}
		</ToolbarDropdownItem>
	);
};

export const createCodeBlockMenuItem = (api: ExtractInjectionAPI<CodeBlockPlugin> | undefined) => {
	return (): React.JSX.Element => <CodeBlockMenuItem api={api} />;
};
