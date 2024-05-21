import React from 'react';
import { defaultSchema as schema } from '@atlaskit/adf-schema/schema-default';
import { mediaInlineWithAnnotation } from './__fixtures__/media-inline';
import { ReactSerializer } from '../../../index';
import {
  type ReactTestRenderer,
  create,
  type ReactTestInstance,
} from 'react-test-renderer';
import AnnotationComponent from '../../marks/annotation';
import { IntlProvider } from 'react-intl-next';

describe('Renderer - ReactSerializer - MediaInline', () => {
  describe('mediaInline with Annotation', () => {
    let reactRenderer: ReactTestRenderer;
    beforeAll(() => {
      const reactSerializer = new ReactSerializer({
        allowAnnotations: true,
        isCommentsOnMediaMediaInlineBugFixEnabled: true,
      });
      const docFromSchema = schema.nodeFromJSON(mediaInlineWithAnnotation);
      const withIntl = () => (
        <IntlProvider locale="en">
          {reactSerializer.serializeFragment(docFromSchema.content)}
        </IntlProvider>
      );

      reactRenderer = create(withIntl());
    });

    it('should only render span with annotation id', () => {
      const testInstance = reactRenderer.root;

      const components = testInstance.findAllByType(AnnotationComponent);
      components.forEach((component) => {
        expect(component.props.isMediaInline).toBe(true);

        const children = component.children[0] as ReactTestInstance;

        expect(children.type).toBe('span');
        expect(children.props['id']).toBeDefined();
        expect(children.props.children).toBeDefined();
        expect(Object.keys(children.props).length).toBe(2);
      });
    });
  });
});
