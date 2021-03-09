import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { createSchema } from '@atlaskit/adf-schema';
import { InlineCard, InlineCardNodeViewProps } from '../../inlineCard';
import InlineNodeWrapper from '../../../../../ui/InlineNodeWrapper';

describe('InlineCard ReactNodeView', () => {
  it('should use <InlineNodeWrapper /> with right options', () => {
    const schema = createSchema({
      nodes: ['doc', 'paragraph', 'inlineCard', 'text'],
    });
    const url = 'https://product-fabric.atlassian.net/browse/ED-1';
    const node = schema.nodes.inlineCard.create({ url });
    const createEditor = createEditorFactory();
    const editor = createEditor({});
    const { editorView, portalProviderAPI, eventDispatcher } = editor;
    const getPos = jest.fn();
    const reactComponentProps: InlineCardNodeViewProps = {
      useInlineWrapper: true,
    };
    const inlineCardNodeView = new InlineCard(
      node,
      editorView,
      getPos,
      portalProviderAPI,
      eventDispatcher,
      reactComponentProps,
      undefined,
      true,
    ).init();
    expect(inlineCardNodeView.createDomRef().contentEditable).toEqual('false');
    expect(inlineCardNodeView.render().type).toEqual(InlineNodeWrapper);
  });
});
