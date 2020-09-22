import {
  create,
  ReactTestRenderer,
  ReactTestInstance,
} from 'react-test-renderer';
import { defaultSchema as schema } from '@atlaskit/adf-schema';
import { Node as PMNode, Node } from 'prosemirror-model';
import { ReactSerializer } from '../../../index';
import {
  nestedBulletList,
  nestedOrderedList,
  nestedBulletAndOrderedList,
} from './__fixtures__/documents';
import BulletList from '../../../react/nodes/bulletList';
import OrderedList from '../../../react/nodes/orderedList';

describe('Renderer - ReactSerializer - Lists', () => {
  let docFromSchema: PMNode;
  let reactRenderer: ReactTestRenderer;

  describe('when the nested list is a bullet list', () => {
    beforeAll(() => {
      const reactSerializer = new ReactSerializer({
        allowAnnotations: false,
      });
      docFromSchema = schema.nodeFromJSON(nestedBulletList);
      reactRenderer = create(
        reactSerializer.serializeFragment(docFromSchema.content) as any,
      );
    });

    it('should have the correct data-indent-level', () => {
      const testInstance = reactRenderer.root;
      const components = testInstance.findAllByType(BulletList);
      expect(components).toHaveLength(6);
      components.forEach(({ props, children }, idx) => {
        const listHTMLComponent = children[0] as ReactTestInstance;
        const listParentNodes = props['path'].filter(
          (node: Node) => node.type.name === 'bulletList',
        );
        expect(listParentNodes).toHaveLength(idx);
        expect(listHTMLComponent.props['data-indent-level']).toEqual(idx + 1);
      });
    });
  });

  describe('when the nested list is an ordered list', () => {
    beforeAll(() => {
      const reactSerializer = new ReactSerializer({
        allowAnnotations: false,
      });
      docFromSchema = schema.nodeFromJSON(nestedOrderedList);
      reactRenderer = create(
        reactSerializer.serializeFragment(docFromSchema.content) as any,
      );
    });

    it('should have the correct data-indent-level', () => {
      const testInstance = reactRenderer.root;
      const components = testInstance.findAllByType(OrderedList);
      expect(components).toHaveLength(6);
      components.forEach(({ props, children }, idx) => {
        const listHTMLComponent = children[0] as ReactTestInstance;
        const listParentNodes = props['path'].filter(
          (node: Node) => node.type.name === 'orderedList',
        );
        expect(listParentNodes).toHaveLength(idx);
        expect(listHTMLComponent.props['data-indent-level']).toEqual(idx + 1);
      });
    });
  });

  describe('when the nested list is an ordered list', () => {
    beforeAll(() => {
      const reactSerializer = new ReactSerializer({
        allowAnnotations: false,
      });
      docFromSchema = schema.nodeFromJSON(nestedBulletAndOrderedList);
      reactRenderer = create(
        reactSerializer.serializeFragment(docFromSchema.content) as any,
      );
    });

    it('should have the correct data-indent-level for a nested mixed bullet and ordered list', () => {
      const testInstance = reactRenderer.root;
      const isListType = (node: ReactTestInstance) => {
        return node.type === BulletList || node.type === OrderedList
          ? true
          : false;
      };
      const components = testInstance.findAll(isListType);
      expect(components).toHaveLength(6);
      components.forEach(({ props, children }, idx) => {
        const listHTMLComponent = children[0] as ReactTestInstance;
        const listParentNodes = props['path'].filter(
          (node: Node) =>
            node.type.name === 'orderedList' || node.type.name === 'bulletList',
        );

        expect(listParentNodes).toHaveLength(idx);
        expect(listHTMLComponent.props['data-indent-level']).toEqual(idx + 1);
      });
    });
  });
});
