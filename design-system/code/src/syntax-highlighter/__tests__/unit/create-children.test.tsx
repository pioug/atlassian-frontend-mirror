import { AST } from 'refractor';

import createChildren from '../../lib/react-renderer/create-children';

const actual = jest.requireActual('../../lib/react-renderer/create-element');
const createElementSpy = jest.spyOn(actual, 'default');

// nodes
const textTestNode: AST.Text = { type: 'text', value: 'text' };
const textTestNode1: AST.Text = { type: 'text', value: 'text1' };

// properties
const codeBidiWarningConfig = {
  codeBidiWarnings: true,
  codeBidiWarningTooltipEnabled: true,
};

describe('createChildren', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call createElement for 1 child node using passed arguments', () => {
    const createChildrenFunction = createChildren(codeBidiWarningConfig);
    createChildrenFunction([textTestNode]);

    expect(createElementSpy).toHaveBeenCalledTimes(1);
    expect(createElementSpy).toHaveBeenCalledWith({
      node: textTestNode,
      codeBidiWarningConfig,
      key: 'code-segment-1-0',
    });
  });

  it('should call createElement for every child', () => {
    const createChildrenFunction = createChildren(codeBidiWarningConfig);
    createChildrenFunction([textTestNode, textTestNode1]);

    expect(createElementSpy).toHaveBeenCalledTimes(2);
    expect(createElementSpy.mock.calls[0][0]).toEqual({
      node: textTestNode,
      codeBidiWarningConfig,
      key: 'code-segment-1-0',
    });
    expect(createElementSpy.mock.calls[1][0]).toEqual({
      node: textTestNode1,
      codeBidiWarningConfig,
      key: 'code-segment-1-1',
    });
  });

  it('should not call createElement if no children passed', () => {
    const createChildrenFunction = createChildren(codeBidiWarningConfig);
    createChildrenFunction([]);

    expect(createElementSpy).not.toHaveBeenCalled();
  });
});
