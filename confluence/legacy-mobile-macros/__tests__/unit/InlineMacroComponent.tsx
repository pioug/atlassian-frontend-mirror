import React from 'react';

import { createRenderer } from 'react-test-renderer/shallow';

import { macroExtensionHandlerKey } from '../../src/ui/constants';
import { InlineMacroComponent } from '../../src/ui/InlineMacroComponent';
import { Anchor } from '../../src/ui/InlineMacroComponent/Anchor';

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
    expect(result.type).toEqual(Anchor);
  });
});
