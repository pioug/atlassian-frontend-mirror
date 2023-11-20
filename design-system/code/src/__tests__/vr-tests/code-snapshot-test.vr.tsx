import { snapshot } from '@af/visual-regression';

import InlineCodeBasic from '../../../examples/01-inline-code-basic';
import CodeBlockBasic from '../../../examples/10-code-block-basic';
import CodeBlockSsr from '../../../examples/12-code-block-ssr';
import CodeBlockHighlightingLongLines from '../../../examples/14-code-block-highlighting-long-lines';
import CodeBlockEmpty from '../../../examples/21-code-block-empty';
import CodeBidiCharacters from '../../../examples/22-code-bidi-characters';
import Applescript from '../../../examples/applescript';
import CascadingStyleSheets from '../../../examples/cascading-style-sheets';
import Clojure from '../../../examples/clojure';
import Delphi from '../../../examples/delphi';
import Diff from '../../../examples/diff';
import Foxpro from '../../../examples/foxpro';
import Jsx from '../../../examples/jsx';
import ObjectPascal from '../../../examples/object-pascal';
import Qml from '../../../examples/qml';
import StandardMl from '../../../examples/standard-ml';
import VisualBasic from '../../../examples/visual-basic';
import VrPythonTestIdAndWrapping from '../../../examples/vr-python-test-id-and-wrapping';

snapshot(InlineCodeBasic, {
  variants: [
    {
      name: 'Default',
      environment: {},
    },
    {
      name: 'Light',
      environment: {
        colorScheme: 'light',
      },
    },
    {
      name: 'Dark',
      environment: {
        colorScheme: 'dark',
      },
    },
  ],
});
snapshot(CodeBlockBasic, {
  variants: [
    {
      name: 'Default',
      environment: {},
    },
    {
      name: 'Light',
      environment: {
        colorScheme: 'light',
      },
    },
    {
      name: 'Dark',
      environment: {
        colorScheme: 'dark',
      },
    },
  ],
});
snapshot(CodeBlockSsr);
snapshot(Applescript);
snapshot(Clojure);
snapshot(Delphi);
snapshot(Diff);
snapshot(Foxpro);
snapshot(ObjectPascal);
snapshot(Qml);
snapshot(StandardMl);
snapshot(VisualBasic);
snapshot(CascadingStyleSheets);
snapshot(Jsx);
snapshot(CodeBlockEmpty);
snapshot(CodeBidiCharacters);
snapshot(CodeBlockHighlightingLongLines);
snapshot(VrPythonTestIdAndWrapping);
