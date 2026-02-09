import { AnalyticsStep, BatchAttrsStep, SetAttrsStep } from '@atlaskit/adf-schema/steps';
import type { AnalyticsEventPayload, EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';
import {
	TELEPOINTER_DATA_SESSION_ID_ATTR,
	TELEPOINTER_PULSE_DURING_TR_CLASS,
	TELEPOINTER_PULSE_DURING_TR_DURATION_MS,
	type CollabEditOptions,
	type CollabParticipant,
} from '@atlaskit/editor-common/collab';
import { processRawValueWithoutValidation } from '@atlaskit/editor-common/process-raw-value';
import { ZERO_WIDTH_JOINER } from '@atlaskit/editor-common/whitespace';
import {
	type EditorState,
	type ReadonlyTransaction,
	Transaction,
	Selection,
	TextSelection,
} from '@atlaskit/editor-prosemirror/state';
import { AttrStep, ReplaceStep } from '@atlaskit/editor-prosemirror/transform';
import type { Step } from '@atlaskit/editor-prosemirror/transform';
import type { DecorationSet, EditorView } from '@atlaskit/editor-prosemirror/view';
import { Decoration } from '@atlaskit/editor-prosemirror/view';
import { getParticipantColor } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

export const findPointers = (id: string, decorations: DecorationSet): Decoration[] =>
	decorations
		.find()
		.reduce<
			Decoration[]
		>((arr, deco) => (deco.spec.pointer.presenceId === id ? arr.concat(deco) : arr), []);

function style(options: { color: string }) {
	const color = (options && options.color) || token('color.border', 'black');
	const borderWidth = token('border.width.focused', '2px');
	return `border-right: ${borderWidth} solid ${color}; margin-right: calc(-1 * ${borderWidth}); z-index: 1`;
}

export function getAvatarColor(str: string) {
	const participantColor = getParticipantColor(str);

	return {
		index: participantColor.index,
		backgroundColor: participantColor.color.backgroundColor,
		textColor: participantColor.color.textColor,
	};
}

export const createTelepointers = (
	from: number,
	to: number,
	sessionId: string,
	isSelection: boolean,
	initial: string,
	presenceId: string,
	fullName: string,
	isNudged: boolean,
) => {
	const decorations: Decoration[] = [];
	const avatarColor = getAvatarColor(presenceId);
	const color = avatarColor.index.toString();
	if (isSelection) {
		const className = `telepointer color-${color} telepointer-selection`;
		decorations.push(
			Decoration.inline(from, to, { class: className }, { pointer: { sessionId, presenceId } }),
		);
	}

	const spaceJoinerBefore = document.createElement('span');
	spaceJoinerBefore.textContent = ZERO_WIDTH_JOINER;
	const spaceJoinerAfter = document.createElement('span');
	spaceJoinerAfter.textContent = ZERO_WIDTH_JOINER;

	const cursor = document.createElement('span');
	cursor.textContent = ZERO_WIDTH_JOINER;
	cursor.className = `telepointer color-${color} telepointer-selection-badge`;
	cursor.style.cssText = `${style({ color: avatarColor.backgroundColor })};`;
	cursor.setAttribute('aria-label', `${fullName} cursor position`);
	cursor.setAttribute('role', 'button');
	cursor.setAttribute(TELEPOINTER_DATA_SESSION_ID_ATTR, sessionId);

	// If there is an ongoing expand animation, we'll keep the telepointer expanded
	// until the keyframe animation is complete. Please note that this will restart the anim timer
	// from 0 everytime it's re-added.
	if (isNudged) {
		cursor.classList.add(TELEPOINTER_PULSE_DURING_TR_CLASS);
	}

	const fullNameEl = document.createElement('span');
	fullNameEl.textContent = fullName;
	fullNameEl.className = 'telepointer-fullname';
	fullNameEl.style.backgroundColor = avatarColor.backgroundColor;
	fullNameEl.style.color = avatarColor.textColor;
	fullNameEl.setAttribute('aria-hidden', 'true');
	cursor.appendChild(fullNameEl);

	const initialEl = document.createElement('span');
	initialEl.textContent = initial;
	initialEl.className = 'telepointer-initial';
	initialEl.style.backgroundColor = avatarColor.backgroundColor;
	initialEl.style.color = avatarColor.textColor;
	initialEl.setAttribute('aria-hidden', 'true');
	cursor.appendChild(initialEl);

	return decorations
		.concat(
			Decoration.widget(to, spaceJoinerAfter, {
				pointer: { sessionId, presenceId },
				key: `telepointer-${sessionId}-zero`,
			}),
		)
		.concat(
			Decoration.widget(to, cursor, {
				pointer: { sessionId, presenceId },
				key: `telepointer-${sessionId}`,
			}),
		)
		.concat(
			Decoration.widget(to, spaceJoinerBefore, {
				pointer: { sessionId, presenceId },
				key: `telepointer-${sessionId}-zero`,
			}),
		);
};

export const replaceDocument = (
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	doc: any,
	state: EditorState,
	version?: number,
	options?: CollabEditOptions,
	reserveCursor?: boolean,
	editorAnalyticsAPI?: EditorAnalyticsAPI,
) => {
	const { schema, tr } = state;

	const parsedDoc = processRawValueWithoutValidation(
		schema,
		doc,
		editorAnalyticsAPI?.fireAnalyticsEvent,
	);
	const hasContent = !!parsedDoc?.childCount;
	const content = parsedDoc?.content;

	if (hasContent) {
		tr.setMeta('addToHistory', false);
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		tr.replaceWith(0, state.doc.nodeSize - 2, content!);
		const selection = state.selection;
		if (reserveCursor) {
			// If the cursor is still in the range of the new document,
			// keep where it was.
			if (selection.to < tr.doc.content.size - 2) {
				const $from = tr.doc.resolve(selection.from);
				const $to = tr.doc.resolve(selection.to);
				const newselection = new TextSelection($from, $to);
				tr.setSelection(newselection);
			}
		} else {
			tr.setSelection(Selection.atStart(tr.doc));
		}
		tr.setMeta('replaceDocument', true);

		if (typeof version !== undefined && options && options.useNativePlugin) {
			const collabState = { version, unconfirmed: [] };
			tr.setMeta('collab$', collabState);
		}
	}

	return tr;
};

export const scrollToCollabCursor = (
	editorView: EditorView,
	participants: CollabParticipant[],
	sessionId: string | undefined,
	// analytics: AnalyticsEvent | undefined,
	index: number,
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): void => {
	const selectedUser = participants[index];
	if (
		selectedUser &&
		selectedUser.cursorPos !== undefined &&
		selectedUser.sessionId !== sessionId
	) {
		const { state } = editorView;
		const tr = state.tr;
		const analyticsPayload: AnalyticsEventPayload = {
			action: ACTION.MATCHED,
			actionSubject: ACTION_SUBJECT.SELECTION,
			eventType: EVENT_TYPE.TRACK,
		};
		tr.setSelection(Selection.near(tr.doc.resolve(selectedUser.cursorPos)));
		editorAnalyticsAPI?.attachAnalyticsEvent(analyticsPayload)(tr);
		tr.scrollIntoView();
		editorView.dispatch(tr);
		if (!editorView.hasFocus()) {
			editorView.focus();
		}
	}
};

export const getPositionOfTelepointer = (
	sessionId: string,
	decorationSet: DecorationSet,
): undefined | number => {
	let scrollPosition;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	decorationSet.find().forEach((deco: any) => {
		if (deco.type.spec.pointer.sessionId === sessionId) {
			scrollPosition = deco.from;
		}
	});
	return scrollPosition;
};

export const isReplaceStep = (step: Step) => step instanceof ReplaceStep;

export const originalTransactionHasMeta = (
	transaction: Transaction | ReadonlyTransaction,
	metaTag: string,
): boolean => {
	const hasMetaTag = Boolean(transaction.getMeta(metaTag));
	if (hasMetaTag) {
		return true;
	}
	const appendedTransaction = transaction.getMeta('appendedTransaction');
	if (appendedTransaction instanceof Transaction) {
		return originalTransactionHasMeta(appendedTransaction, metaTag);
	}
	return false;
};

/**
 * This list contains step attributes that do not result from a user action.
 * All steps that contain ONLY the blocked attribute are considered automated steps
 * and should not be recognised as organic change.
 *
 * `attr_colwidth` is an exception to above explanation. Resizing the column
 * currently creates too many steps and is therefore also on this list.
 *
 * Steps analycs dashboard: https://atlassian-discover.cloud.databricks.com/dashboardsv3/01ef4d3c8aa916c8b0cb5332a9f37caf/published?o=4482001201517624
 */
const blockedAttrsList = [
	'__contextId',
	'localId',
	'__autoSize',
	'attr_colwidth',
	'originalHeight',
	'originalWidth',
];

/**
 * Takes the transaction and editor state and checks if the transaction is considered organic change
 * @param tr Transaction
 * @returns boolean
 */
export const isOrganicChange = (tr: ReadonlyTransaction): boolean => {
	// If document has not been marked as `docChanged` by PM, skip the rest of the logic
	if (!tr.docChanged) {
		return false;
	}

	return tr.steps.some((step: Step) => {
		// If a step is an instance of AnalyticsStep, it is not considered organic
		if (step instanceof AnalyticsStep) {
			return false;
		}

		// editor-plugin-local-id uses AttrStep to set the localId attribute
		if (step instanceof AttrStep && step.attr === 'localId') {
			return false;
		}

		// editor-plugin-local-id uses BatchAttrStep to set the localId attribute
		if (step instanceof BatchAttrsStep) {
			const allAttributes = step.data.map((data) => Object.keys(data.attrs)).flat();
			return (
				allAttributes.some((attr) => !blockedAttrsList.includes(attr)) && !tr.doc.eq(tr.before)
			);
		}

		// If a step is not an instance of SetAttrsStep, it is considered organic
		if (!(step instanceof SetAttrsStep)) {
			return true;
		}

		const allAttributes = Object.keys(step.attrs);
		// If a step is an instance of SetAttrsStep, it checks if the attributes in the step
		// are not in the `blockedAttributes`. If one of the attributes not on the list, it considers the change
		// organic but only if the entire document is not equal to the previous state.
		return allAttributes.some((attr) => !blockedAttrsList.includes(attr)) && !tr.doc.eq(tr.before);
	});
};

// If we receive a transaction while there is an ongoing CSS expand animation in the telepointer,
// it will be cut off due to the removal of the element. We'll persist the animation state in the plugin,
// so we can keep the expanded version showing even when the telepointer element is recreated.
export type NudgeAnimationsMap = Map<string, number>;
export const hasExistingNudge = (
	sessionId: string,
	nudgeAnimations: NudgeAnimationsMap,
): boolean => {
	const nudgeAnimStartTime = nudgeAnimations.get(sessionId);
	let hasExistingNudge = false;
	if (nudgeAnimStartTime) {
		const timeElapsed = Date.now() - nudgeAnimStartTime;
		hasExistingNudge = timeElapsed < TELEPOINTER_PULSE_DURING_TR_DURATION_MS;
	}
	return hasExistingNudge;
};
