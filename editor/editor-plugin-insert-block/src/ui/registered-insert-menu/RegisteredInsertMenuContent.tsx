import React, { useCallback, useContext, useState } from 'react';

import { MENU } from '@atlaskit/editor-common/quick-insert/keys';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { PlainOutsideClickTargetRefContext, withOuterListeners } from '@atlaskit/editor-common/ui';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { RegisterComponent } from '@atlaskit/editor-ui-control-model/types';

import type { InsertBlockPlugin } from '../../insertBlockPluginType';
import { RegisteredInsertMenu } from './RegisteredInsertMenu';

type Props = {
	api?: ExtractInjectionAPI<InsertBlockPlugin>;
	editorView: EditorView;
	isOffline: boolean;
	maxHeight?: number;
	onClose: () => void;
	onDismiss: () => void;
	onSelect: () => void;
	target?: HTMLElement | null;
};

const RegisteredInsertMenuContainer = ({ children }: React.PropsWithChildren) => {
	const setOutsideClickTargetRef = useContext(PlainOutsideClickTargetRefContext);

	return <div ref={setOutsideClickTargetRef}>{children}</div>;
};

const RegisteredInsertMenuWithListeners = withOuterListeners<React.PropsWithChildren>(
	RegisteredInsertMenuContainer,
);

export const RegisteredInsertMenuContent = ({
	api,
	editorView,
	isOffline,
	maxHeight,
	onClose,
	onDismiss,
	onSelect,
	target,
}: Props): React.JSX.Element => {
	// Keep registrations stable while the open menu is searched or navigated.
	const [components] = useState<RegisterComponent[]>(
		() => api?.uiControlRegistry?.actions.getComponents(MENU.key) ?? [],
	);
	const onClickOutside = useCallback(
		(event: MouseEvent) => {
			if (event.target instanceof Node && target?.contains(event.target)) {
				return;
			}
			onDismiss();
		},
		[onDismiss, target],
	);

	return (
		<RegisteredInsertMenuWithListeners handleClickOutside={onClickOutside}>
			<RegisteredInsertMenu
				components={components}
				editorView={editorView}
				emptyStateHandler={api?.quickInsert?.sharedState.currentState()?.emptyStateHandler}
				isOffline={isOffline}
				maxHeight={maxHeight}
				onClose={onClose}
				onSelect={onSelect}
			/>
		</RegisteredInsertMenuWithListeners>
	);
};
