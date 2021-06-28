import React from 'react';
import { defaultSchema as schema } from '@atlaskit/adf-schema';
import { create } from 'react-test-renderer';
import { Node as PMNode } from 'prosemirror-model';
import { ReactSerializer } from '../../../index';
import { complexDocument as doc } from './__fixtures__/documents';
import * as NodeUtil from '../../nodes';
import * as MarkUtil from '../../marks';

describe('Renderer - ReactSerializer - TextWrapperComponent', () => {
  let docFromSchema: PMNode;
  beforeAll(() => {
    docFromSchema = schema.nodeFromJSON(doc);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const FakeComp: React.FC = ({ children }) => {
    return <>children</>;
  };
  describe('when surroundTextNodesWithTextWrapper is true', () => {
    it('should not serialize Mark or Node component using a duplicated key', () => {
      jest.spyOn(NodeUtil, 'toReact').mockReturnValue(FakeComp);
      jest.spyOn(MarkUtil, 'toReact').mockReturnValue(FakeComp);
      const createElementSpy = jest.spyOn(React, 'createElement');
      const reactSerializer = new ReactSerializer({
        surroundTextNodesWithTextWrapper: true,
      });

      create(reactSerializer.serializeFragment(docFromSchema.content) as any);

      expect(createElementSpy).toHaveBeenCalled();
      const keys = new Set();

      createElementSpy.mock.calls.forEach((call) => {
        if (!call || !call[1] || !call[1].key) {
          return;
        }

        const elementKey = call[1].key;

        if (keys.has(elementKey)) {
          fail(`The key: ${elementKey} as added twice`);
        } else {
          keys.add(elementKey);
        }
      });
    });
  });
});
