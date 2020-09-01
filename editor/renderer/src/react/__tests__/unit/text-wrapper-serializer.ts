import { mount, ReactWrapper } from 'enzyme';
import { defaultSchema as schema } from '@atlaskit/adf-schema';
import { Node as PMNode } from 'prosemirror-model';
import { ReactSerializer } from '../../../index';
import TextWrapperComponent from '../../nodes/text-wrapper';
import { complexDocument as doc } from './__fixtures__/documents';

describe('Renderer - ReactSerializer - TextWrapperComponent', () => {
  let docFromSchema: PMNode;
  beforeAll(() => {
    docFromSchema = schema.nodeFromJSON(doc);
  });

  describe('when surroundTextNodesWithTextWrapper is true', () => {
    let reactDoc: ReactWrapper;
    beforeAll(() => {
      const reactSerializer = new ReactSerializer({
        surroundTextNodesWithTextWrapper: true,
      });

      reactDoc = mount(
        reactSerializer.serializeFragment(docFromSchema.content) as any,
      );
    });

    afterAll(() => {
      reactDoc.unmount();
    });

    it('should match TextWrapper position props with ProseMirror node positions', () => {
      const textWrappers = reactDoc.find(TextWrapperComponent);

      let index = 0;
      docFromSchema.nodesBetween(0, docFromSchema.nodeSize - 2, (node, pos) => {
        if (node.type.name === 'codeBlock') {
          return false;
        }

        if (!node.isText) {
          return true;
        }

        const elementWrapper = textWrappers.at(index);
        const elementProps = elementWrapper.props();

        index++;

        expect(node.text).toBe(elementProps.text);
        expect(pos).toBe(elementProps.startPos);
        expect(pos + node.nodeSize).toBe(elementProps.endPos);
      });
    });
  });

  describe('when surroundTextNodesWithTextWrapper is false', () => {
    it('should not create a text wrapper for each text content', () => {
      const reactSerializer = new ReactSerializer({
        surroundTextNodesWithTextWrapper: false,
      });
      const reactDoc = mount(
        reactSerializer.serializeFragment(docFromSchema.content) as any,
      );
      const textWrappers = reactDoc.find(TextWrapperComponent);
      expect(textWrappers.length).toEqual(0);
    });
  });
});
