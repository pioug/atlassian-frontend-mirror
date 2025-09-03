/**
 * @jsxRuntime classic
 * @jsxFrag jsx
 * @jsx jsx
 */

// import Popup from '@atlaskit/popup';
import { useEffect, useState } from 'react';

import { css as cssUnbounded } from '@compiled/react';
import { useIntl } from 'react-intl-next';

import { css, cssMap, jsx } from '@atlaskit/css';
import {
	ACTION,
	ACTION_SUBJECT,
	type EditorAnalyticsAPI,
	EVENT_TYPE,
	MODE,
	PLATFORMS,
	type RequestToEditAEP,
} from '@atlaskit/editor-common/analytics';
import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import { tasksAndDecisionsMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Popup } from '@atlaskit/editor-common/ui';
import {
	OutsideClickTargetRefContext,
	withReactEditorViewOuterListeners as withOuterListeners,
} from '@atlaskit/editor-common/ui-react';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorFloatingDialogZIndex } from '@atlaskit/editor-shared-styles';
import Heading from '@atlaskit/heading';
import EditorDoneIcon from '@atlaskit/icon/core/migration/check-mark--editor-done';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Pressable, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import type { TasksAndDecisionsPlugin } from '../../tasksAndDecisionsPluginType';

interface Props {
	api: ExtractInjectionAPI<TasksAndDecisionsPlugin> | undefined;
	boundariesElement?: HTMLElement;
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
	editorView: EditorView;
	element: HTMLElement;
	mountTo?: HTMLElement;
	onClose: () => void;
	scrollableElement?: HTMLElement;
}

const PopupWithListeners = withOuterListeners(Popup);

const TRYING_REQUEST_TIMEOUT = 3000;

const popupContentWrapper = css({
	paddingTop: token('space.025', '2px'),
	paddingBottom: token('space.025', '2px'),
	paddingLeft: token('space.025', '2px'),
	paddingRight: token('space.025', '2px'),
	borderRadius: token('radius.small', '3px'),
	boxShadow: token('elevation.shadow.overlay'),
	backgroundColor: token('elevation.surface.overlay'),
});

const wrapperStyles = css({
	display: 'flex',
	flexDirection: 'column',
	maxWidth: '333px',
	paddingTop: token('space.200'),
	paddingRight: token('space.300'),
	paddingBottom: token('space.200'),
	paddingLeft: token('space.300'),
});

const wrapperBoxStyles = css({
	display: 'flex',
	alignItems: 'center',
	gap: token('space.050'),
	color: token('color.text.disabled'),
});

const dotStyles = css({
	marginTop: token('space.100'),
	marginBottom: token('space.100'),
	marginLeft: token('space.100'),
	marginRight: token('space.100'),
	display: 'inline-block',
	width: '2px',
	height: '2px',
	backgroundColor: token('color.background.accent.blue.bolder'),
});

const dotStylesUnbounded = cssUnbounded({
	borderRadius: '50%',
});

const pressableStyles = cssMap({
	pressable: {
		paddingTop: token('space.0'),
		paddingBottom: token('space.0'),
		paddingLeft: token('space.0'),
		paddingRight: token('space.0'),
		// @ts-expect-error - TODO should use token here, https://product-fabric.atlassian.net/browse/EDF-2517
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontSize: '14px',
		color: token('color.text.brand'),
		backgroundColor: token('color.background.neutral.subtle'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
		'&:hover': {
			textDecoration: 'underline',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
		'&:active': {
			color: token('color.link.pressed'),
		},
	},
});

const anaylyticsEventPayload = (
	action: ACTION.REQUEST_TO_EDIT | ACTION.DISMISSED,
): RequestToEditAEP => {
	return {
		action,
		actionSubject: ACTION_SUBJECT.REQUEST_TO_EDIT_POP_UP,
		eventType: EVENT_TYPE.UI,
		attributes: {
			platform: PLATFORMS.WEB,
			mode: MODE.EDITOR,
		},
	};
};

const RequestedMessage = () => {
	const { formatMessage } = useIntl();
	return (
		<>
			{formatMessage(tasksAndDecisionsMessages.requestToEdit)}
			<EditorDoneIcon label="requested-to-edit" color={token('color.icon.disabled')} />
		</>
	);
};

const RequestToEditButton = ({
	onClick,
}: {
	isDisabled?: boolean;
	onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
	const { formatMessage } = useIntl();
	return (
		<Box>
			<Pressable
				onClick={onClick}
				xcss={pressableStyles.pressable}
				testId="request-to-edit-popup-request-btn"
			>
				{formatMessage(tasksAndDecisionsMessages.requestToEdit)}
			</Pressable>
		</Box>
	);
};

export const RequestToEditPopup = ({
	element,
	api,
	editorView,
	onClose,
	mountTo,
	boundariesElement,
	scrollableElement,
}: Props) => {
	const hasRequestedEditPermission = useSharedPluginStateSelector(
		api,
		'taskDecision.hasRequestedEditPermission',
	);
	const openRequestToEditPopupAt = useSharedPluginStateSelector(
		api,
		'taskDecision.openRequestToEditPopupAt',
	);

	const [isOpen, setIsOpen] = useState(!!openRequestToEditPopupAt);
	const [requested, setRequested] = useState(hasRequestedEditPermission);
	const [tryingRequest, setTryingRequest] = useState(false);
	const { formatMessage } = useIntl();

	useEffect(() => {
		setRequested(hasRequestedEditPermission);
	}, [hasRequestedEditPermission]);

	useEffect(() => {
		if (!tryingRequest) {
			const timout = setTimeout(() => {
				setTryingRequest(false);
			}, TRYING_REQUEST_TIMEOUT);

			return () => clearTimeout(timout);
		}
	}, [tryingRequest]);

	const onHandleEdit = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation();
		const viewMode = api?.editorViewMode?.sharedState.currentState()?.mode;
		if (viewMode !== 'view') {
			return;
		}
		const editorAnalyticsAPI = api?.analytics?.actions;
		setTryingRequest(true);
		const { tr } = editorView.state;

		tr.setMeta('scrollIntoView', false);

		if (!api?.taskDecision?.sharedState.currentState()?.hasEditPermission) {
			const requestToEdit = api?.taskDecision?.sharedState.currentState()?.requestToEditContent;
			if (requestToEdit) {
				requestToEdit();
			}
		}

		editorAnalyticsAPI?.attachAnalyticsEvent(anaylyticsEventPayload(ACTION.REQUEST_TO_EDIT))(tr);
		editorView.dispatch(tr);
	};

	const onHandleDismiss = (editorAnalyticsAPI: EditorAnalyticsAPI | undefined) => {
		editorAnalyticsAPI?.fireAnalyticsEvent(anaylyticsEventPayload(ACTION.DISMISSED));
		setIsOpen(false);
		onClose();
	};

	const onHandleCancel = (event: MouseEvent | KeyboardEvent) => {
		if (fg('platform_editor_task_check_status_fix')) {
			// Check if the click is on task item checkbox, if so, do not close the popup
			const target = event.target as Node | null;
			if (target && (element.contains(target) || element === target)) {
				return;
			}
		}
		setIsOpen(false);
		onClose();
	};

	if (!isOpen) {
		return null;
	}

	return (
		<PopupWithListeners
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			target={element!}
			fitHeight={148}
			handleClickOutside={onHandleCancel}
			handleEscapeKeydown={onHandleCancel}
			zIndex={akEditorFloatingDialogZIndex}
			mountTo={mountTo}
			boundariesElement={boundariesElement}
			scrollableElement={scrollableElement}
			ariaLabel={null}
			preventOverflow={true}
			focusTrap={true}
			captureClick={true}
		>
			<OutsideClickTargetRefContext.Consumer>
				{(setOutsideClickTargetRef) => (
					<div css={popupContentWrapper} ref={setOutsideClickTargetRef}>
						<div css={wrapperStyles}>
							<Stack space="space.150">
								<Heading size="xsmall">
									{formatMessage(tasksAndDecisionsMessages.editAccessTitle)}
								</Heading>
								<div>{formatMessage(tasksAndDecisionsMessages.requestToEditDescription)}</div>
								<div css={wrapperBoxStyles}>
									{tryingRequest || requested ? (
										<RequestedMessage />
									) : (
										<RequestToEditButton onClick={onHandleEdit} />
									)}
									<div css={[dotStyles, dotStylesUnbounded]}></div>
									<Box>
										<Pressable
											onClick={() => onHandleDismiss(api?.analytics?.actions)}
											xcss={pressableStyles.pressable}
											testId="request-to-edit-popup-cancel-btn"
										>
											{formatMessage(tasksAndDecisionsMessages.dismiss)}
										</Pressable>
									</Box>
								</div>
							</Stack>
						</div>
					</div>
				)}
			</OutsideClickTargetRefContext.Consumer>
		</PopupWithListeners>
	);
};
