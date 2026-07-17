import React, { useCallback, useMemo } from 'react';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { DomAtPos } from '@atlaskit/editor-prosemirror/utils';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { commitStatusPicker, updateStatus } from '../pm-plugins/actions';
import type { StatusPlugin } from '../statusPluginType';
import type { StatusType, ClosingPayload } from '../types';

import { getSuggestedStatuses } from './getSuggestedStatuses';
import StatusPicker from './statusPicker';

interface ContentComponentProps {
	api: ExtractInjectionAPI<StatusPlugin> | undefined;
	domAtPos: DomAtPos;
	editorView: EditorView;
	popupsBoundariesElement?: HTMLElement;
	popupsMountPoint?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
}

/** Renders the status picker popup for the currently selected status node. */
export function ContentComponent({
	api,
	popupsMountPoint,
	popupsBoundariesElement,
	popupsScrollableElement,
	editorView,
	domAtPos,
}: ContentComponentProps): React.JSX.Element | null {
	const { statusState } = useSharedPluginState(api, ['status']);
	const { showStatusPickerAt } = statusState ?? {};

	const target = useMemo(
		() =>
			// Ignored via go/ees005
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			showStatusPickerAt ? (findDomRefAtPos(showStatusPickerAt, domAtPos) as HTMLElement) : null,
		[showStatusPickerAt, domAtPos],
	);

	const statusNode = useMemo(
		() => (showStatusPickerAt ? editorView.state.doc.nodeAt(showStatusPickerAt) : undefined),
		// eslint-disable-next-line react-hooks/exhaustive-deps -- preserve original recompute cadence for the ungated path
		[showStatusPickerAt, editorView],
	);

	const onSelect = useCallback(
		(status: StatusType) => {
			updateStatus(status)(editorView.state, editorView.dispatch);
		},
		[editorView],
	);

	const onTextChanged = useCallback(
		(status: StatusType) => {
			updateStatus(status)(editorView.state, editorView.dispatch);
		},
		[editorView],
	);
	const closeStatusPicker = useCallback(
		(closingPayload?: ClosingPayload) => {
			commitStatusPicker(closingPayload)(editorView);
		},
		[editorView],
	);
	const onEnter = useCallback(() => {
		commitStatusPicker()(editorView);
	}, [editorView]);

	const onSuggestedStatusClick = useCallback(
		(status: StatusType) => {
			const currentLocalId =
				typeof showStatusPickerAt === 'number'
					? editorView.state.doc.nodeAt(showStatusPickerAt)?.attrs.localId
					: undefined;
			const suggestedStatus = {
				color: status.color,
				...(currentLocalId ? { localId: currentLocalId } : {}),
				...(status.style ? { style: status.style } : {}),
				text: status.text,
			};
			const didUpdateStatus = updateStatus(suggestedStatus)(editorView.state, editorView.dispatch);
			if (didUpdateStatus) {
				commitStatusPicker()(editorView);
			}
		},
		[editorView, showStatusPickerAt],
	);

	const suggestedStatuses = useMemo(() => {
		if (
			typeof showStatusPickerAt !== 'number' ||
			!expValEquals('platform_editor_status_popup_suggestions', 'isEnabled', true)
		) {
			return [];
		}

		// Read the node directly from the current doc so suggestions reflect the latest
		// document state (the memoized `statusNode` intentionally preserves the original
		// recompute cadence for the ungated path).
		const currentNode = editorView.state.doc.nodeAt(showStatusPickerAt);
		if (!currentNode || currentNode.type.name !== 'status') {
			return [];
		}

		const { color, localId, text } = currentNode.attrs;

		return getSuggestedStatuses({
			currentPos: showStatusPickerAt,
			currentStatus: { color, localId, text },
			doc: editorView.state.doc,
			shouldUppercaseText: fg('platform-dst-lozenge-tag-badge-visual-uplifts'),
		});
	}, [showStatusPickerAt, editorView.state.doc]);

	if (typeof showStatusPickerAt !== 'number') {
		return null;
	}

	if (!statusNode || statusNode.type.name !== 'status') {
		return null;
	}

	const { text, color, localId, style } = statusNode.attrs;

	const displayText =
		style !== 'mixedCase' && fg('platform-dst-lozenge-tag-badge-visual-uplifts')
			? text.toUpperCase()
			: text;

	return (
		<StatusPicker
			isNew={statusState?.isNew}
			focusStatusInput={statusState?.focusStatusInput}
			target={target}
			defaultText={displayText}
			defaultColor={color}
			defaultLocalId={localId}
			mountTo={popupsMountPoint}
			boundariesElement={popupsBoundariesElement}
			scrollableElement={popupsScrollableElement}
			onSelect={onSelect}
			onTextChanged={onTextChanged}
			closeStatusPicker={closeStatusPicker}
			onEnter={onEnter}
			onSuggestedStatusClick={onSuggestedStatusClick}
			editorView={editorView}
			api={api}
			suggestedStatuses={suggestedStatuses}
		/>
	);
}
