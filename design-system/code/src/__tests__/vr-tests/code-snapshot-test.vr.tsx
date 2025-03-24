import { snapshot } from '@af/visual-regression';

import InlineCodeBasic from '../../../examples/01-inline-code-basic';
import CodeBlockBasic from '../../../examples/10-code-block-basic';
import CodeBlockBasicWithTabs from '../../../examples/11-code-block-basic-with-tabs';
import CodeBlockHighlightingLongLines from '../../../examples/14-code-block-highlighting-long-lines';
import CodeBlockEmpty from '../../../examples/21-code-block-empty';
import CodeBidiCharacters from '../../../examples/22-code-bidi-characters';
import CodeOverrideBackground from '../../../examples/23-code-override-background';
import ExampleABAP from '../../../examples/abap';
import Applescript from '../../../examples/applescript';
import CascadingStyleSheets from '../../../examples/cascading-style-sheets';
import Clojure from '../../../examples/clojure';
import Delphi from '../../../examples/delphi';
import Diff from '../../../examples/diff';
import Foxpro from '../../../examples/foxpro';
import Jsx from '../../../examples/jsx';
import ObjectPascal from '../../../examples/object-pascal';
import Qml from '../../../examples/qml';
import ExampleSQL from '../../../examples/sql';
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
	],
});

snapshot(CodeBlockBasicWithTabs);
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
snapshot(CodeOverrideBackground);
snapshot(ExampleSQL);
snapshot(ExampleABAP, {
	featureFlags: {
		platform_dst_code_abap_syntax: [true, false],
	},
});
