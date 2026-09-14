import React from 'react';
import { IntlProvider } from 'react-intl';
import { AnnotationUpdateEvent } from '@atlaskit/editor-common/types';
import { AnnotationMarkStates, AnnotationTypes } from '@atlaskit/adf-schema/annotation';
import { render } from '@atlassian/testing-library/render';
import { MarkElement } from '../../';
import { InlineCommentsStateContext } from '../../../context';
import * as HooksMock from '../../../hooks/use-inline-comment-subscriber';
jest.mock('../../../hooks/use-inline-comment-subscriber');

describe('Annotations/Mark', () => {
	describe('when on click is called', () => {
		it('should emit click event', async () => {
			const fakeId = 'fakeId';
			const fakeDataAttributes = {
				'data-renderer-mark': true,
				'data-mark-type': 'annotation',
				'data-mark-annotation-type': AnnotationTypes.INLINE_COMMENT,
				'data-id': fakeId,
			};
			const annotationParentIds: string[] = [];
			const updateSubscriberFake = {
				on: jest.fn(),
				off: jest.fn(),
				emit: jest.fn(),
			};
			// @ts-ignore
			HooksMock.useInlineCommentSubscriberContext.mockReturnValue(updateSubscriberFake);

			const { container } = render(
				<IntlProvider locale="en">
					<InlineCommentsStateContext.Provider value={{ [fakeId]: AnnotationMarkStates.ACTIVE }}>
						<MarkElement
							id={fakeId}
							dataAttributes={fakeDataAttributes}
							annotationType={AnnotationTypes.INLINE_COMMENT}
							annotationParentIds={annotationParentIds}
						>
							<small>some</small>
						</MarkElement>
					</InlineCommentsStateContext.Provider>
				</IntlProvider>,
			);

			const mark = container.querySelector('mark');
			expect(mark).not.toBeNull();

			mark!.click();

			expect(updateSubscriberFake.emit).toHaveBeenCalledWith(
				AnnotationUpdateEvent.ON_ANNOTATION_CLICK,
				{
					annotationIds: [fakeId],
					eventTarget: mark,
				},
			);
		});
	});
});
