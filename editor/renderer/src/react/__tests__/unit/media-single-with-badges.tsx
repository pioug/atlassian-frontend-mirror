import React from 'react';
import { render, screen } from '@testing-library/react';
import MediaWithDraftAnnotation from '../../nodes/media';
import {
	type AnnotationMarkDefinition,
	AnnotationTypes,
	AnnotationMarkStates,
	type BorderMarkDefinition,
	type LinkDefinition,
	type MediaType,
} from '@atlaskit/adf-schema';
import { InlineCommentsStateContext } from '../../../ui/annotations/context';
import { IntlProvider } from 'react-intl-next';

jest.mock('@atlaskit/editor-common/media-single', () => ({
	...jest.requireActual('@atlaskit/editor-common/media-single'),
	CommentBadgeNext: () => <span data-testid="comment-badge">Comment Component</span>,
}));

type Props = {
	excerptIncludeClass: boolean;
	includeNodeType: boolean;
	type?: MediaType;
};

const createMockProps = (props: Props) => {
	const { includeNodeType, excerptIncludeClass, type } = props;

	const mockProps = {
		type: type ?? ('file' as MediaType),
		marks: [mockAnnotationMark, mockLinkDefinition, mockBorderMark],
		featureFlags: {},
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

	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<IntlProvider locale="en">
				<InlineCommentsStateContext.Provider value={nextState}>
					<MediaWithDraftAnnotation
						{...createMockProps({
							includeNodeType: false,
							excerptIncludeClass: false,
						})}
					/>
				</InlineCommentsStateContext.Provider>
				,
			</IntlProvider>,
		);

		await expect(container).toBeAccessible();
	});

	it('should show CommentBadge if there is a comment', () => {
		const { queryByTestId } = render(
			<IntlProvider locale="en">
				<InlineCommentsStateContext.Provider value={nextState}>
					<MediaWithDraftAnnotation
						{...createMockProps({
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

	it('should not show CommentBadge when closest nodeType is include', () => {
		const { queryByTestId } = render(
			<IntlProvider locale="en">
				<InlineCommentsStateContext.Provider value={nextState}>
					<MediaWithDraftAnnotation
						{...createMockProps({
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

	it('should not show CommentBadge when closest className is ak-excerpt-include', () => {
		const { queryByTestId } = render(
			<IntlProvider locale="en">
				<InlineCommentsStateContext.Provider value={nextState}>
					<MediaWithDraftAnnotation
						{...createMockProps({
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

	describe('ExternalImageBadge', () => {
		it('should show ExternalImageBadge when node type is external', () => {
			const renderExternal = () =>
				render(
					<IntlProvider locale="en">
						<InlineCommentsStateContext.Provider value={nextState}>
							<MediaWithDraftAnnotation
								{...createMockProps({
									includeNodeType: false,
									excerptIncludeClass: false,
									type: 'external',
								})}
							/>
						</InlineCommentsStateContext.Provider>
					</IntlProvider>,
				);

			renderExternal();
			const externalImageBadge = screen.queryByTestId('external-image-badge');
			expect(externalImageBadge).not.toBeNull();
		});

		it('should not show ExternalImageBadge when node type is not external', () => {
			const renderFile = () =>
				render(
					<IntlProvider locale="en">
						<InlineCommentsStateContext.Provider value={nextState}>
							<MediaWithDraftAnnotation
								{...createMockProps({
									includeNodeType: false,
									excerptIncludeClass: false,
									type: 'file',
								})}
							/>
						</InlineCommentsStateContext.Provider>
					</IntlProvider>,
				);

			renderFile();
			const externalImageBadge = screen.queryByTestId('external-image-badge');
			expect(externalImageBadge).toBeNull();
		});
	});
});
