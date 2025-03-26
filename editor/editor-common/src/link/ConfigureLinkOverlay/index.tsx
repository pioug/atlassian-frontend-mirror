/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type MouseEvent, useCallback, useLayoutEffect, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import withAnalyticsContext from '@atlaskit/analytics-next/withAnalyticsContext';
import { NodeSelection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import PreferencesIcon from '@atlaskit/icon/core/migration/customize--preferences';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { cardMessages } from '../../messages';

import Dropdown, { type OnDropdownChange } from './Dropdown';
import { StyledButton } from './StyledButton';
import { useLinkOverlayAnalyticsEvents } from './useLinkOverlayAnalyticsEvents';

const buttonWrapperStyles = css({
	position: 'absolute',
	zIndex: 100,
	display: 'inline-flex',
	top: '50%',
	transform: 'translateY(-50%)',
	background: token('elevation.surface.raised'),
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
	/**
	 * Called when the open link button in the dropdown is clicked.
	 */
	onOpenLinkClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

const showDropdownThresholdPx = 50;

export const OverlayButton = withAnalyticsContext()(({
	editorView,
	testId = 'link-configure-overlay-button',
	targetElementPos = 0,
	onDropdownChange,
	onOpenLinkClick,
}: OverlayButtonProps) => {
	const { formatMessage } = useIntl();
	const configureLinkLabel = formatMessage(cardMessages.inlineConfigureLink);
	const [showDropdown, setShowDropdown] = useState(false);

	const { fireActionClickEvent, fireLinkClickEvent } = useLinkOverlayAnalyticsEvents();

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

	const handleConfigureClick = useCallback(() => {
		const tr = editorView.state.tr;
		if (isText) {
			tr.setSelection(
				TextSelection.create(tr.doc, targetElementPos, Math.min(nodeEnd, tr.doc.nodeSize)),
			);
		} else {
			tr.setSelection(NodeSelection.create(tr.doc, targetElementPos));
		}
		editorView.dispatch(tr);
	}, [editorView, isText, targetElementPos, nodeEnd]);

	const handleConfigureClickWithAnalytics = useCallback(() => {
		fireActionClickEvent('configureLink');
		fireLinkClickEvent();
		handleConfigureClick();
	}, [fireLinkClickEvent, handleConfigureClick, fireActionClickEvent]);

	const { from, to } = editorView.state.selection;
	const isSelected = from === targetElementPos && to === nodeEnd;

	if (!targetElementPos || isSelected) {
		return null;
	}

	return (
		<span css={buttonWrapperStyles} data-testid={testId}>
			{showDropdown ? (
				<Dropdown
					testId={testId}
					onConfigureClick={handleConfigureClick}
					onOpenLinkClick={onOpenLinkClick}
					onDropdownChange={onDropdownChange}
					editorView={editorView}
				/>
			) : (
				<Tooltip
					content={configureLinkLabel}
					hideTooltipOnClick={true}
					testId={`${testId}-tooltip`}
				>
					<StyledButton
						onClick={handleConfigureClickWithAnalytics}
						iconBefore={
							<PreferencesIcon
								label={configureLinkLabel}
								LEGACY_size="small"
								testId={`${testId}-configure-icon`}
							/>
						}
					/>
				</Tooltip>
			)}
		</span>
	);
});
