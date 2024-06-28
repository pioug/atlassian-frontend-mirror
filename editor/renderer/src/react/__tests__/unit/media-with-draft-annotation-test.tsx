import React from 'react';
import { render } from '@testing-library/react';
import MediaWithDraftAnnotation from '../../nodes/media';
import {
	type AnnotationMarkDefinition,
	AnnotationTypes,
	type BorderMarkDefinition,
	type LinkDefinition,
	type MediaType,
} from '@atlaskit/adf-schema';
import { InlineCommentsStateContext } from '../../../ui/annotations/context';
import { AnnotationMarkStates } from '@atlaskit/adf-schema';
import { IntlProvider } from 'react-intl-next';

jest.mock('@atlaskit/editor-common/media-single', () => ({
	CommentBadge: () => <span data-testid="comment-badge">Comment Component</span>,
}));

type Props = {
	commentsOnMedia: boolean;
	commentsOnMediaIncludePage: boolean;
	commentsOnMediaInsertExcerpt: boolean;
	includeNodeType: boolean;
	excerptIncludeClass: boolean;
};

const createMockProps = (props: Props) => {
	const {
		commentsOnMedia,
		commentsOnMediaIncludePage,
		commentsOnMediaInsertExcerpt,
		includeNodeType,
		excerptIncludeClass,
	} = props;

	const mockProps = {
		type: 'file' as MediaType,
		marks: [mockAnnotationMark, mockLinkDefinition, mockBorderMark],
		featureFlags: { commentsOnMedia, commentsOnMediaIncludePage, commentsOnMediaInsertExcerpt },
		mediaSingleElement: document.createElement('div'),
		isBorderMark: () => true,
		isLinkMark: () => true,
		isDrafting: true,
		isAnnotationMark: () => true,
	};
	mockProps.mediaSingleElement.closest = jest.fn((selector) => {
		if (selector === '[data-node-type="include"]') {
			return includeNodeType;
		} else if (selector === '.ak-excerpt-include') {
			return excerptIncludeClass;
		}
		return null;
	});
	return mockProps;
};

const mockAnnotationMark: AnnotationMarkDefinition = {
	type: 'annotation',
	attrs: {
		id: '1',
		annotationType: AnnotationTypes.INLINE_COMMENT,
	},
};
const mockLinkDefinition: LinkDefinition = {
	attrs: {
		href: 'https://google.com',
	},
	type: 'link',
};
const mockBorderMark: BorderMarkDefinition = {
	attrs: {
		color: 'blue',
		size: 2,
	},
	type: 'border',
};

describe('MediaWithDraftAnnotation', () => {
	let nextState: Record<string, AnnotationMarkStates>;

	beforeEach(() => {
		nextState = { 1: AnnotationMarkStates.ACTIVE };
	});

	it('should show CommentBadge when commentsOnMedia flag is true', () => {
		const { queryByTestId } = render(
			<IntlProvider locale="en">
				<InlineCommentsStateContext.Provider value={nextState}>
					<MediaWithDraftAnnotation
						{...createMockProps({
							commentsOnMedia: true,
							commentsOnMediaIncludePage: false,
							commentsOnMediaInsertExcerpt: false,
							includeNodeType: false,
							excerptIncludeClass: false,
						})}
					/>
				</InlineCommentsStateContext.Provider>
				,
			</IntlProvider>,
		);

		const commentBadge = queryByTestId('comment-badge');
		expect(commentBadge).not.toBeNull();
	});

	it('should not show CommentBadge when commentsOnMedia flag is false', () => {
		const { queryByTestId } = render(
			<IntlProvider locale="en">
				<InlineCommentsStateContext.Provider value={nextState}>
					<MediaWithDraftAnnotation
						{...createMockProps({
							commentsOnMedia: false,
							commentsOnMediaIncludePage: false,
							commentsOnMediaInsertExcerpt: false,
							includeNodeType: false,
							excerptIncludeClass: false,
						})}
					/>
				</InlineCommentsStateContext.Provider>
				,
			</IntlProvider>,
		);

		const commentBadge = queryByTestId('comment-badge');
		expect(commentBadge).toBeNull();
	});

	it('should show CommentBadge when commentsOnMediaIncludePage is false and closest nodeType is include', () => {
		const { queryByTestId } = render(
			<IntlProvider locale="en">
				<InlineCommentsStateContext.Provider value={nextState}>
					<MediaWithDraftAnnotation
						{...createMockProps({
							commentsOnMedia: true,
							commentsOnMediaIncludePage: false,
							commentsOnMediaInsertExcerpt: false,
							includeNodeType: true,
							excerptIncludeClass: false,
						})}
					/>
				</InlineCommentsStateContext.Provider>
				,
			</IntlProvider>,
		);

		const commentBadge = queryByTestId('comment-badge');
		expect(commentBadge).not.toBeNull();
	});

	it('should not show CommentBadge when commentsOnMediaIncludePage is true and closest nodeType is include', () => {
		const { queryByTestId } = render(
			<IntlProvider locale="en">
				<InlineCommentsStateContext.Provider value={nextState}>
					<MediaWithDraftAnnotation
						{...createMockProps({
							commentsOnMedia: true,
							commentsOnMediaIncludePage: true,
							commentsOnMediaInsertExcerpt: false,
							includeNodeType: true,
							excerptIncludeClass: false,
						})}
					/>
				</InlineCommentsStateContext.Provider>
				,
			</IntlProvider>,
		);

		const commentBadge = queryByTestId('comment-badge');
		expect(commentBadge).toBeNull();
	});

	it('should show CommentBadge when commentsOnMediaInsertExcerpt is false and closest className is ak-excerpt-include', () => {
		const { queryByTestId } = render(
			<IntlProvider locale="en">
				<InlineCommentsStateContext.Provider value={nextState}>
					<MediaWithDraftAnnotation
						{...createMockProps({
							commentsOnMedia: true,
							commentsOnMediaIncludePage: false,
							commentsOnMediaInsertExcerpt: false,
							includeNodeType: false,
							excerptIncludeClass: true,
						})}
					/>
				</InlineCommentsStateContext.Provider>
				,
			</IntlProvider>,
		);

		const commentBadge = queryByTestId('comment-badge');
		expect(commentBadge).not.toBeNull();
	});

	it('should not show CommentBadge when commentsOnMediaInsertExcerpt is true and closest className is ak-excerpt-include', () => {
		const { queryByTestId } = render(
			<IntlProvider locale="en">
				<InlineCommentsStateContext.Provider value={nextState}>
					<MediaWithDraftAnnotation
						{...createMockProps({
							commentsOnMedia: true,
							commentsOnMediaIncludePage: false,
							commentsOnMediaInsertExcerpt: true,
							includeNodeType: false,
							excerptIncludeClass: true,
						})}
					/>
				</InlineCommentsStateContext.Provider>
				,
			</IntlProvider>,
		);

		const commentBadge = queryByTestId('comment-badge');
		expect(commentBadge).toBeNull();
	});
});
