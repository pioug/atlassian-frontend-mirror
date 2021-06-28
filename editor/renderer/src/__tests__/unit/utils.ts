import { defaultSchema } from '@atlaskit/adf-schema';
import { doc, p, strong } from '@atlaskit/editor-test-helpers/doc-builder';
import { ADFEncoder } from '../../index';
import { getText, findInTree } from '../../utils';

describe('Renderer - utils', () => {
  describe('ADFEncoder', () => {
    let transformerProvider: any;
    let transformer: any;

    beforeEach(() => {
      transformer = { encode: jest.fn(), parse: jest.fn() };
      transformerProvider = jest.fn((_schema) => transformer);
    });

    it('should pass the default schema to the transformer provider', () => {
      // @ts-ignore
      const encoder = new ADFEncoder(transformerProvider);
      expect(transformerProvider).toHaveBeenCalledWith(defaultSchema);
      expect(transformerProvider).toHaveBeenCalledTimes(1);
    });

    it('should use the provided transformer to parse a given value', () => {
      transformer.parse.mockReturnValue(
        doc(p('hello ', strong('world')))(defaultSchema),
      );
      const encoder = new ADFEncoder(transformerProvider);
      expect(encoder.encode('stubbed')).toEqual({
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'hello ' },
              { type: 'text', text: 'world', marks: [{ type: 'strong' }] },
            ],
          },
        ],
      });
    });
  });

  describe('getText', () => {
    it('should process ADNode and return text representation', () => {
      const node = { type: 'hardBreak' };
      expect(getText(node)).toEqual('[hardBreak]');
    });
    it('should process ProseMirror node and return text representation', () => {
      const node = p('hello')(defaultSchema);
      expect(getText(node)).toEqual('[paragraph]');
    });
  });

  describe('findInTree', () => {
    it("doesn't run evaluate if top parent is reached", () => {
      const evaluate = jest.fn();
      const elementA = ({ parentElement: undefined } as any) as HTMLElement;

      const result = findInTree(elementA, elementA, evaluate);
      expect(evaluate).toBeCalledTimes(0);
      expect(result).toBe(false);
    });

    it('matches given element if it satisfies evaluate', () => {
      const evaluate = (element: any) => element.id === 2;
      const elementA = ({
        parentElement: undefined,
        id: 1,
      } as any) as HTMLElement;
      const elementB = ({
        parentElement: elementA,
        id: 2,
      } as any) as HTMLElement;

      const result = findInTree(elementB, elementA, evaluate);
      expect(result).toBe(true);
    });

    it("matches an element that isn't given and isn't the top if satisfies evaluate", () => {
      const evaluate = (element: any) => element.id === 2;
      const elementA = ({
        parentElement: undefined,
        id: 1,
      } as any) as HTMLElement;
      const elementB = ({
        parentElement: elementA,
        id: 2,
      } as any) as HTMLElement;
      const elementC = ({
        parentElement: elementB,
        id: 3,
      } as any) as HTMLElement;

      const result = findInTree(elementC, elementA, evaluate);
      expect(result).toBe(true);
    });

    it('returns false if no elements satisfy evaluate', () => {
      const evaluate = (element: any) => element.id === 4;
      const elementA = ({
        parentElement: undefined,
        id: 1,
      } as any) as HTMLElement;
      const elementB = ({
        parentElement: elementA,
        id: 2,
      } as any) as HTMLElement;
      const elementC = ({
        parentElement: elementB,
        id: 3,
      } as any) as HTMLElement;

      const result = findInTree(elementC, elementA, evaluate);
      expect(result).toBe(false);
    });
  });
});
