import React, { useCallback, useContext, useEffect, useSyncExternalStore } from 'react';

import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics/types/enums';
import { MENU } from '@atlaskit/editor-common/quick-insert/keys';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import { PlainOutsideClickTargetRefContext } from '@atlaskit/editor-common/ui';
import withOuterListeners from '@atlaskit/editor-common/with-outer-listeners';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { RegisterComponent } from '@atlaskit/editor-ui-control-model/types';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import type { InsertBlockPlugin } from '../../insertBlockPluginType';
import { RegisteredInsertMenu } from './RegisteredInsertMenu';

const EMPTY_COMPONENTS: RegisterComponent[] = [];
const subscribeToNothing = () => () => {};

const fireElementBrowserAnalyticsEvent = (
	api: ExtractInjectionAPI<InsertBlockPlugin> | undefined,
	action: ACTION.OPENED | ACTION.CLOSED,
) =>
	api?.analytics?.actions.fireAnalyticsEvent({
		action,
		actionSubject: ACTION_SUBJECT.ELEMENT_BROWSER,
		eventType: EVENT_TYPE.UI,
		attributes: { mode: 'inline' },
	});

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
	const getComponents = useCallback(() => {
		const components = api?.uiControlRegistry?.actions.getComponents(MENU.key);
		return components?.length ? components : EMPTY_COMPONENTS;
	}, [api]);
	const components = useSyncExternalStore(
		api?.uiControlRegistry?.actions.subscribe ?? subscribeToNothing,
		getComponents,
		getComponents,
	);
	useEffect(() => {
		if (!fg('platform_editor_slash_command_analytics')) {
			return;
		}
		fireElementBrowserAnalyticsEvent(api, ACTION.OPENED);
		api?.quickInsert?.actions.fireQuickInsertOpened('toolbar');
		return () => {
			fireElementBrowserAnalyticsEvent(api, ACTION.CLOSED);
		};
	}, [api]);
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
				isOffline={isOffline}
				maxHeight={maxHeight}
				onClose={onClose}
				onSelect={onSelect}
			/>
		</RegisteredInsertMenuWithListeners>
	);
};
