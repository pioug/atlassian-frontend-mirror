import { mount, ReactWrapper } from 'enzyme';
import { defaultSchema as schema } from '@atlaskit/adf-schema';
import { ReactSerializer } from '../../../index';
import TextWrapperComponent from '../../nodes/text-wrapper';

const doc = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Some ',
        },
      ],
    },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'text',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const docFromSchema = schema.nodeFromJSON(doc);

describe('Renderer - ReactSerializer - TextWrapperComponent', () => {
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

    it('should create a text wrapper for each text content', () => {
      const textWrappers = reactDoc.find(TextWrapperComponent);

      expect(textWrappers.length).toEqual(2);
    });

    it('should send the starting position as parameter', () => {
      const textWrappers = reactDoc.find(TextWrapperComponent);
      const first = textWrappers.first();

      expect(first.prop('startPos')).toEqual(1);
      expect(first.prop('endPos')).toEqual(6);
    });

    it('should calc the depth node position', () => {
      const textWrappers = reactDoc.find(TextWrapperComponent);
      const last = textWrappers.last();

      expect(last.prop('startPos')).toEqual(10);
      expect(last.prop('endPos')).toEqual(14);
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
