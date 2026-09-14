import { bind } from 'bind-event-listener';
import type { IntlShape } from 'react-intl';

import { ACTION_SUBJECT_ID } from '@atlaskit/editor-common/analytics';
import { getBrowserInfo } from '@atlaskit/editor-common/browser';
import { unsupportedContentMessages } from '@atlaskit/editor-common/messages';
import type { UnsupportedContentTooltipPayload } from '@atlaskit/editor-common/utils';
import { trackUnsupportedContentTooltipDisplayedFor } from '@atlaskit/editor-common/utils/track-unsupported-content';
import {
	VANILLA_TOOLTIP_DEFAULT_CLASS,
	VanillaTooltip,
} from '@atlaskit/editor-common/vanilla-tooltip';
import { ZERO_WIDTH_SPACE } from '@atlaskit/editor-common/whitespace';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import type { DOMOutputSpec, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { NodeView } from '@atlaskit/editor-prosemirror/view';

import { getUnsupportedContent } from './get-unsupported-content';
import { getUnsupportedContentIconSpec } from './get-unsupported-content-icon-spec';

const VanillaUnsupportedInlineCssClassName = {
	INNER: 'unsupported-inline-vanilla-inner',
	ICON: 'unsupported-vanilla-icon',
};

/** Identifies this tooltip for tests and debugging. */
const TOOLTIP_CLASS_NAME = 'unsupported-content-tooltip';

/** Distinct from the block node view's prefix, so the counter fallback below cannot collide. */
const TOOLTIP_ID_PREFIX = 'unsupported-inline-content-tooltip';

/** Classes applied to the tooltip element: the shared default look, plus our own hook. */
const TOOLTIP_CLASS_NAMES = `${VANILLA_TOOLTIP_DEFAULT_CLASS} ${TOOLTIP_CLASS_NAME}`;
const INLINE_NODE_VIEW_CLASS_NAME = 'inlineNodeView';
const ZERO_WIDTH_SPACE_CONTAINER_CLASS_NAME = 'zeroWidthSpaceContainer';
const ADD_ZERO_WIDTH_SPACE_CLASS_NAME = `${INLINE_NODE_VIEW_CLASS_NAME}AddZeroWidthSpace`;

const nextTooltipId = (() => {
	let count = 0;
	return () =>
		typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
			? `${TOOLTIP_ID_PREFIX}-${crypto.randomUUID()}`
			: `${TOOLTIP_ID_PREFIX}-${(count += 1)}`;
})();

function getInlineSpec(node: PMNode, label: string): DOMOutputSpec {
	const browser = getBrowserInfo();
	const trailingSpec = browser.android
		? [
				'span',
				{ class: ZERO_WIDTH_SPACE_CONTAINER_CLASS_NAME, contentEditable: 'false' },
				['span', { class: ADD_ZERO_WIDTH_SPACE_CLASS_NAME }],
				ZERO_WIDTH_SPACE,
			]
		: ['span', { class: ADD_ZERO_WIDTH_SPACE_CLASS_NAME }];

	return [
		'span',
		{
			class: `${node.type.name}View-content-wrap ${INLINE_NODE_VIEW_CLASS_NAME}`,
			contentEditable: 'false',
		},
		[
			'span',
			{ class: ZERO_WIDTH_SPACE_CONTAINER_CLASS_NAME },
			['span', { class: ADD_ZERO_WIDTH_SPACE_CLASS_NAME }],
			ZERO_WIDTH_SPACE,
		],
		[
			'span',
			{ class: VanillaUnsupportedInlineCssClassName.INNER },
			label,
			getUnsupportedContentIconSpec(VanillaUnsupportedInlineCssClassName.ICON),
		],
		trailingSpec,
	];
}

function createUnsupportedInlineDOM(node: PMNode, intl: IntlShape) {
	const label = getUnsupportedContent(
		unsupportedContentMessages.unsupportedInlineContent,
		'Unsupported',
		node,
		intl,
	);
	const { dom } = DOMSerializer.renderSpec(document, getInlineSpec(node, label));
	const domElement = dom instanceof HTMLElement ? dom : undefined;
	const icon =
		domElement?.querySelector<HTMLElement>(`.${VanillaUnsupportedInlineCssClassName.ICON}`) ?? null;
	return { dom, icon };
}

export class UnsupportedInlineNodeViewVanilla implements NodeView {
	dom: Node;

	private node: PMNode;
	private tooltip: VanillaTooltip | null = null;
	private unbindMouseenter: (() => void) | null = null;

	constructor(
		node: PMNode,
		intl: IntlShape,
		dispatchAnalyticsEvent: ((payload: UnsupportedContentTooltipPayload) => void) | undefined,
	) {
		this.node = node;
		const { dom, icon } = createUnsupportedInlineDOM(node, intl);
		this.dom = dom;

		if (!icon) {
			return;
		}

		this.unbindMouseenter = bind(icon, {
			type: 'mouseenter',
			options: { once: true },
			listener: (event) => {
				this.unbindMouseenter?.();
				this.unbindMouseenter = null;
				const tooltipText = intl.formatMessage(
					unsupportedContentMessages.unsupportedContentTooltip,
				);
				this.tooltip = new VanillaTooltip(
					icon as unknown as HTMLButtonElement,
					tooltipText,
					nextTooltipId(),
					TOOLTIP_CLASS_NAMES,
					300,
					// Use default style by having the default tooltip class name.
					undefined,
					() => {
						if (dispatchAnalyticsEvent) {
							trackUnsupportedContentTooltipDisplayedFor(
								dispatchAnalyticsEvent,
								ACTION_SUBJECT_ID.ON_UNSUPPORTED_INLINE,
								this.node?.attrs?.originalValue?.type,
							);
						}
					},
				);
				icon.dispatchEvent(new Event(event.type));
			},
		});
	}

	update(node: PMNode): boolean {
		if (node.type !== this.node.type) {
			return false;
		}
		if (!this.node.sameMarkup(node)) {
			return false;
		}
		this.node = node;
		return true;
	}

	ignoreMutation(mutation: MutationRecord | { type: 'selection' }): boolean {
		return mutation.type !== 'selection';
	}

	destroy(): void {
		this.tooltip?.destroy();
		this.tooltip = null;
		this.unbindMouseenter?.();
		this.unbindMouseenter = null;
	}
}
