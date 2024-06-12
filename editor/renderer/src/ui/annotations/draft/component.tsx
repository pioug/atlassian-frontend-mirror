/** @jsx jsx */
import React, { Fragment } from 'react';
import { css, jsx } from '@emotion/react';

import type { Position } from '../types';
import { InsertDraftPosition } from '../types';
import { AnnotationsDraftContext } from '../context';
import { splitText, calcTextSplitOffset, findTextString } from './text';
import { calcInsertDraftPositionOnText } from './position';
import { dataAttributes } from './dom';
import type { Mark } from '@atlaskit/editor-prosemirror/model';

import type { TextHighlighter } from '../../../react/types';
import { AnnotationSharedCSSByState } from '@atlaskit/editor-common/styles';
import { segmentText } from '../../../react/utils/segment-text';
import { renderTextSegments } from '../../../react/utils/render-text-segments';

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
const markStyles = () =>
	css(
		{
			color: 'inherit',
			backgroundColor: 'unset',
			WebkitTapHighlightColor: 'transparent',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		AnnotationSharedCSSByState().focus,
	);

export const AnnotationDraft = ({
	draftPosition,
	children,
}: React.PropsWithChildren<{ draftPosition: Position }>) => {
	return (
		<mark data-renderer-mark={true} {...dataAttributes(draftPosition)} css={markStyles}>
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
				<AnnotationDraft key={index} draftPosition={draftPosition}>
					{renderTextSegments(segments, textHighlighter, marks || [], draftPosition.from)}
				</AnnotationDraft>
			);
		}

		return (
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
	const nextDraftPosition = React.useContext(AnnotationsDraftContext);
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
