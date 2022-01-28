import React from 'react';

import { createRenderer } from 'react-test-renderer/shallow';

import { InlineMacroComponent, macroExtensionHandlerKey } from '../../src/ui';
import { Anchor } from '../../src/ui/MacroComponent/InlineMacroComponent/Anchor';

describe('InlineMacroComponent', () => {
  it('should throw an error when the extension key does not match a supported extension', () => {
    const extension = {
      extensionKey: 'nonsense',
      extensionType: macroExtensionHandlerKey,
    };

    const renderer = createRenderer();
    expect(() => {
      renderer.render(<InlineMacroComponent extension={extension} />);
    }).toThrow('nonsense extension key is not supported inline');
  });

  it('should render the Anchor component for anchor extension key', () => {
    const extension = {
      extensionKey: 'anchor',
      extensionType: macroExtensionHandlerKey,
    };

    const renderer = createRenderer();
    renderer.render(<InlineMacroComponent extension={extension} />);
    const result = renderer.getRenderOutput();
    expect(result.props.children.type).toEqual(Anchor);
  });
});
