import React from 'react';

import { IntlProvider } from 'react-intl';

import { defaultSchema as schema } from '@atlaskit/adf-schema/schema-default';
import { render } from '@atlassian/testing-library/render';

import { ReactSerializer } from '../../../index';
import { mediaInlineWithAnnotation } from './__fixtures__/media-inline';

const ANNOTATION_ID = 'fde624ce-7528-4100-a3e8-0bf15e2577c9';

describe('Renderer - ReactSerializer - MediaInline', () => {
	describe('mediaInline with Annotation', () => {
		const renderDocument = () => {
			const reactSerializer = new ReactSerializer({
				allowAnnotations: true,
			});
			const docFromSchema = schema.nodeFromJSON(mediaInlineWithAnnotation);

			return render(
				<IntlProvider locale="en">
					{reactSerializer.serializeFragment(docFromSchema.content)}
				</IntlProvider>,
			).container;
		};

		it('should only render span with annotation id', () => {
			const container = renderDocument();

			const annotation = container.querySelector(`#${ANNOTATION_ID}`);

			expect(annotation).not.toBeNull();
			expect(annotation?.tagName).toBe('SPAN');
			// Inline comments are not supported on mediaInline, so the mark only carries the
			// annotation id - no annotation data attributes, styling or event handling.
			expect(annotation?.getAttributeNames()).toEqual(['id']);
			expect(container.querySelectorAll('[data-mark-type="annotation"]')).toHaveLength(0);
		});
	});
});
