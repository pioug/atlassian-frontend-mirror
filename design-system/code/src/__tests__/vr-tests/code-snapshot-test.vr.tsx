import { snapshot } from '@af/visual-regression';

import InlineCodeBasic from '../../../examples/01-inline-code-basic';
import CodeBlockBasic from '../../../examples/10-code-block-basic';
import CodeBlockBasicWithTabs from '../../../examples/11-code-block-basic-with-tabs';
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
	featureFlags: {
		platform_design_system_team_code_new_typography: [false, true],
	},
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

// Flaky Test https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2942609/steps/%7Bac78f1de-835e-489a-b103-ecfa94d2d44e%7D
snapshot.skip(CodeBlockSsr);

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
