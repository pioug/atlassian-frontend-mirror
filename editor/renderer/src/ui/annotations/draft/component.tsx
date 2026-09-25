/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Fragment, useCallback } from 'react';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports, @atlaskit/ui-styling-standard/use-compiled -- emotion jsx pragma; go/DSP-18766
import { css, jsx } from '@emotion/react'; // oxlint-ignore @typescript-eslint/consistent-type-imports -- classic @jsx jsx factory + jsx.JSX.Element types

import type { Mark } from '@atlaskit/editor-prosemirror/model';
import { token } from '@atlaskit/tokens';

import type { TextHighlighter } from '../../../react/types';
import { renderText } from '../../../react/utils/render-text';
import { useAnnotationManagerDispatch } from '../contexts/AnnotationManagerContext';
import { useAnnotationRangeState } from '../contexts/AnnotationRangeContext';
import type { Position } from '../types';
import { InsertDraftPosition } from '../types';
import { dataAttributes } from './dom';
import { calcInsertDraftPositionOnText } from './position';
import { splitText, calcTextSplitOffset, findTextString } from './text';

// Localized AnnotationSharedCSSByState().common and AnnotationSharedCSSByState().focus
const markStyles = css({
	color: 'inherit',
	backgroundColor: 'unset',
	WebkitTapHighlightColor: 'transparent',
	borderBottom: `${token('border.width.selected')} solid transparent`,
	cursor: 'pointer',
	padding: '1px 0 2px',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&:has(.card), &:has([data-inline-card])': {
		padding: '5px 0 3px 0',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&:has(.date-lozenger-container)': {
		paddingTop: token('space.025'),
	},
	background: token('color.background.accent.yellow.subtlest.pressed'),
	borderBottomColor: token('color.border.accent.yellow'),
	boxShadow: token('elevation.shadow.overlay'),
});

export const AnnotationDraft = ({
	draftPosition,
	children,
}: React.PropsWithChildren<{ draftPosition: Position }>): jsx.JSX.Element => {
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
	draftPosition: Position;
	marks?: readonly Mark[];
	plainTextFastPath?: boolean;
	shouldApplyAnnotationAt:
		| InsertDraftPosition.INSIDE
		| InsertDraftPosition.START
		| InsertDraftPosition.END;
	textHighlighter?: TextHighlighter;
	texts: string[];
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
	plainTextFastPath = false,
}: ApplyAnnotationsProps): JSX.Element[] => {
	const annotateIndex = getAnnotationIndex(shouldApplyAnnotationAt, texts.length);

	return texts.map((value, index) => {
		const rendered = renderText(
			value,
			textHighlighter,
			marks || [],
			draftPosition.from,
			plainTextFastPath,
		);
		if (annotateIndex === index) {
			return (
				// Ignored via go/ees005
				// eslint-disable-next-line react/no-array-index-key
				<AnnotationDraft key={index} draftPosition={draftPosition}>
					{rendered}
				</AnnotationDraft>
			);
		}

		return (
			// Ignored via go/ees005
			// eslint-disable-next-line react/no-array-index-key
			<React.Fragment key={index}>{rendered}</React.Fragment>
		);
	});
};

type Props = React.PropsWithChildren<{
	endPos: number;
	marks?: readonly Mark[];
	plainTextFastPath?: boolean;
	startPos: number;
	textHighlighter?: TextHighlighter;
}>;

export const TextWithAnnotationDraft = ({
	startPos,
	endPos,
	children,
	textHighlighter,
	marks,
	plainTextFastPath = false,
}: Props): jsx.JSX.Element => {
	const textPosition = React.useMemo(
		() => ({
			start: startPos,
			end: endPos,
		}),
		[endPos, startPos],
	);
	const { selectionDraftDocumentPosition: nextDraftPosition } = useAnnotationRangeState();

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
		return (
			<Fragment>
				{renderText(textString, textHighlighter, marks || [], startPos, plainTextFastPath)}
			</Fragment>
		);
	}

	if (shouldApplyAnnotationAt === InsertDraftPosition.AROUND_TEXT) {
		return (
			<AnnotationDraft key={0} draftPosition={nextDraftPosition}>
				{renderText(textString, textHighlighter, marks || [], startPos, plainTextFastPath)}
			</AnnotationDraft>
		);
	}

	const offsets = calcTextSplitOffset(nextDraftPosition, textPosition, textString);
	const texts = splitText(textString, offsets);
	if (!texts) {
		return (
			<Fragment>
				{renderText(textString, textHighlighter, marks || [], startPos, plainTextFastPath)}
			</Fragment>
		);
	}

	const components = applyAnnotationOnText({
		texts,
		shouldApplyAnnotationAt,
		draftPosition: nextDraftPosition,
		textHighlighter,
		marks,
		plainTextFastPath,
	});

	return <Fragment>{components}</Fragment>;
};
