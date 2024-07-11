/** @jsx jsx */
import { useCallback, useLayoutEffect, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import { NodeSelection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import PreferencesIcon from '@atlaskit/icon/glyph/preferences';
import { N0 } from '@atlaskit/theme/colors';
import { layers } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { cardMessages } from '../../messages';

import Dropdown, { type OnDropdownChange } from './Dropdown';
import { StyledButton } from './StyledButton';

const buttonWrapperStyles = css({
	position: 'absolute',
	zIndex: layers.card(),
	display: 'inline-flex',
	top: '50%',
	transform: 'translateY(-50%)',
	background: token('elevation.surface.raised', N0),
	borderRadius: token('border.radius', '3px'),
});

export interface OverlayButtonProps {
	editorView: EditorView;
	testId?: string;
	targetElementPos?: number;
	/**
	 * Called when the dropdown is open/closed with isOpen state as true and false respectively.
	 */
	onDropdownChange?: OnDropdownChange;
}

const showDropdownThresholdPx = 50;

export const OverlayButton = ({
	editorView,
	testId = 'link-configure-overlay-button',
	targetElementPos = 0,
	onDropdownChange,
}: OverlayButtonProps) => {
	const { formatMessage } = useIntl();
	const configureLinkLabel = formatMessage(cardMessages.inlineConfigureLink);
	const [showDropdown, setShowDropdown] = useState(false);

	useLayoutEffect(() => {
		let domNode = editorView.nodeDOM(targetElementPos);

		if (domNode?.nodeType === Node.TEXT_NODE) {
			domNode = domNode.parentElement;
		}
		if (domNode instanceof HTMLElement) {
			const { width } = domNode.getBoundingClientRect();
			if (width < showDropdownThresholdPx) {
				setShowDropdown(true);
			}
		}
	}, [editorView, targetElementPos]);

	const docNode = editorView.state.doc.nodeAt(targetElementPos);
	const nodeEnd = targetElementPos + (docNode?.nodeSize ?? 0);
	const isText = docNode?.isText;

	const handleClick = useCallback(() => {
		const tr = editorView.state.tr;
		if (isText) {
			tr.setSelection(
				TextSelection.create(tr.doc, targetElementPos, Math.min(nodeEnd, tr.doc.nodeSize)),
			);
		} else {
			tr.setSelection(NodeSelection.create(tr.doc, targetElementPos));
		}
		editorView.dispatch(tr);
	}, [isText, editorView, nodeEnd, targetElementPos]);

	const { from, to } = editorView.state.selection;
	const isSelected = from === targetElementPos && to === nodeEnd;

	if (!targetElementPos || isSelected) {
		return null;
	}

	return (
		<span css={buttonWrapperStyles} data-testid={testId}>
			{showDropdown ? (
				<Dropdown testId={testId} onDropdownChange={onDropdownChange} />
			) : (
				<Tooltip
					content={configureLinkLabel}
					hideTooltipOnClick={true}
					testId={`${testId}-tooltip`}
				>
					<StyledButton
						onClick={handleClick}
						iconBefore={
							<PreferencesIcon
								label={configureLinkLabel}
								size="small"
								testId={`${testId}-configure-icon`}
							/>
						}
					/>
				</Tooltip>
			)}
		</span>
	);
};
