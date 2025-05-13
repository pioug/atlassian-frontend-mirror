/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Fragment, useCallback } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';
import type { Mark } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags';

import type { Position } from '../types';
import { InsertDraftPosition } from '../types';
import { AnnotationsDraftContext } from '../context';
import { splitText, calcTextSplitOffset, findTextString } from './text';
import { calcInsertDraftPositionOnText } from './position';
import { dataAttributes } from './dom';

import type { TextHighlighter } from '../../../react/types';
import { segmentText } from '../../../react/utils/segment-text';
import { renderTextSegments } from '../../../react/utils/render-text-segments';
import { useAnnotationManagerDispatch } from '../contexts/AnnotationManagerContext';
import { useAnnotationRangeState } from '../contexts/AnnotationRangeContext';

// Localized AnnotationSharedCSSByState().common and AnnotationSharedCSSByState().focus
const markStyles = css({
	color: 'inherit',
	backgroundColor: 'unset',
	WebkitTapHighlightColor: 'transparent',
	borderBottom: '2px solid transparent',
	cursor: 'pointer',
	padding: '1px 0 2px',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&:has(.card), &:has([data-inline-card])': {
		padding: '5px 0 3px 0',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&:has(.date-lozenger-container)': {
		paddingTop: token('space.025', '2px'),
	},
	background: token('color.background.accent.yellow.subtlest.pressed'),
	borderBottomColor: token('color.border.accent.yellow'),
	boxShadow: token('elevation.shadow.overlay'),
});

export const AnnotationDraft = ({
	draftPosition,
	children,
}: React.PropsWithChildren<{ draftPosition: Position }>) => {
	const { dispatch } = useAnnotationManagerDispatch();

	const markRef = useCallback(
		(node: HTMLElement | null) => {
			dispatch({
				type: 'setDraftMarkRef',
				data: {
					draftMarkRef: node ?? undefined,
				},
			});
		},
		[dispatch],
	);

	return (
		<mark
			data-renderer-mark={true}
			// Ignored via go/ees005
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...dataAttributes(draftPosition)}
			css={markStyles}
			ref={markRef}
		>
			{children}
		</mark>
	);
};

type ApplyAnnotationsProps = {
	texts: string[];
	shouldApplyAnnotationAt:
		| InsertDraftPosition.INSIDE
		| InsertDraftPosition.START
		| InsertDraftPosition.END;
	draftPosition: Position;
	textHighlighter?: TextHighlighter;
	marks?: readonly Mark[];
};

export const getAnnotationIndex = (
	annotationPosition: InsertDraftPosition,
	fragmentCount: number,
): number => {
	if (annotationPosition === InsertDraftPosition.START) {
		return 0;
	}

	if (annotationPosition === InsertDraftPosition.END) {
		return fragmentCount - 1;
	}

	if (annotationPosition === InsertDraftPosition.INSIDE && fragmentCount === 3) {
		return 1;
	}

	return -1;
};

export const applyAnnotationOnText = ({
	texts,
	shouldApplyAnnotationAt,
	draftPosition,
	textHighlighter,
	marks,
}: ApplyAnnotationsProps): JSX.Element[] => {
	const annotateIndex = getAnnotationIndex(shouldApplyAnnotationAt, texts.length);

	return texts.map((value, index) => {
		const segments = segmentText(value, textHighlighter);
		if (annotateIndex === index) {
			return (
				// Ignored via go/ees005
				// eslint-disable-next-line react/no-array-index-key
				<AnnotationDraft key={index} draftPosition={draftPosition}>
					{renderTextSegments(segments, textHighlighter, marks || [], draftPosition.from)}
				</AnnotationDraft>
			);
		}

		return (
			// Ignored via go/ees005
			// eslint-disable-next-line react/no-array-index-key
			<React.Fragment key={index}>
				{renderTextSegments(segments, textHighlighter, marks || [], draftPosition.from)}
			</React.Fragment>
		);
	});
};

type Props = React.PropsWithChildren<{
	startPos: number;
	endPos: number;
	textHighlighter?: TextHighlighter;
	marks?: readonly Mark[];
}>;

export const TextWithAnnotationDraft = ({
	startPos,
	endPos,
	children,
	textHighlighter,
	marks,
}: Props) => {
	const textPosition = React.useMemo(
		() => ({
			start: startPos,
			end: endPos,
		}),
		[endPos, startPos],
	);
	const nextDraftPositionOld = React.useContext(AnnotationsDraftContext);
	const { selectionDraftDocumentPosition } = useAnnotationRangeState();

	const nextDraftPosition = fg('platform_renderer_annotation_draft_position_fix')
		? selectionDraftDocumentPosition
		: nextDraftPositionOld;

	const shouldApplyAnnotationAt = React.useMemo(() => {
		if (!nextDraftPosition) {
			return false;
		}

		return calcInsertDraftPositionOnText(textPosition, nextDraftPosition);
	}, [nextDraftPosition, textPosition]);

	const textString = findTextString(children);
	if (!textString) {
		return <Fragment>{children}</Fragment>;
	}

	if (shouldApplyAnnotationAt === false || !nextDraftPosition) {
		const segments = segmentText(textString, textHighlighter);
		return (
			<Fragment>{renderTextSegments(segments, textHighlighter, marks || [], startPos)}</Fragment>
		);
	}

	if (shouldApplyAnnotationAt === InsertDraftPosition.AROUND_TEXT) {
		const segments = segmentText(textString, textHighlighter);
		return (
			<AnnotationDraft key={0} draftPosition={nextDraftPosition}>
				{renderTextSegments(segments, textHighlighter, marks || [], startPos)}
			</AnnotationDraft>
		);
	}

	const offsets = calcTextSplitOffset(nextDraftPosition, textPosition, textString);
	const texts = splitText(textString, offsets);
	if (!texts) {
		const segments = segmentText(textString, textHighlighter);
		return (
			<Fragment>{renderTextSegments(segments, textHighlighter, marks || [], startPos)}</Fragment>
		);
	}

	const components = applyAnnotationOnText({
		texts,
		shouldApplyAnnotationAt,
		draftPosition: nextDraftPosition,
		textHighlighter,
		marks,
	});

	return <Fragment>{components}</Fragment>;
};
