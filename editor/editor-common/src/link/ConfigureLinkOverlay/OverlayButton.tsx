/** @jsx jsx */
import { useCallback } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import Button from '@atlaskit/button';
import { NodeSelection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import PreferencesIcon from '@atlaskit/icon/glyph/preferences';
import { N0, N30A, N40A, N60A, N700 } from '@atlaskit/theme/colors';
import { layers } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { cardMessages } from '../../messages';

const buttonStyles = css({
	display: 'flex',
	background: token('color.background.neutral', N30A),
	color: token('color.icon', N700),
	'&:hover': {
		background: token('color.background.neutral.hovered', N40A),
	},
	'&:active': {
		background: token('color.background.neutral.pressed', N60A),
	},
	width: '1.375rem',
	height: '1.25rem',
});

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
}

export const OverlayButton = ({
	editorView,
	testId = 'link-configure-overlay-button',
	targetElementPos = 0,
}: OverlayButtonProps) => {
	const { formatMessage } = useIntl();

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

	const configureLinkLabel = formatMessage(cardMessages.inlineConfigureLink);

	return (
		<span css={buttonWrapperStyles}>
			<Tooltip content={configureLinkLabel} hideTooltipOnClick={true} testId={`${testId}-tooltip`}>
				<Button
					testId={testId}
					// eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides
					css={buttonStyles}
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
		</span>
	);
};
