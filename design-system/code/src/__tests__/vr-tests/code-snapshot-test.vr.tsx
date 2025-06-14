import { type Hooks, snapshot, type SnapshotTestOptions } from '@af/visual-regression';

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
import Gherkin from '../../../examples/gherkin';
import Handlebars from '../../../examples/handlebars';
import Jsx from '../../../examples/jsx';
import ObjectPascal from '../../../examples/object-pascal';
import Qml from '../../../examples/qml';
import ExampleSQL from '../../../examples/sql';
import StandardMl from '../../../examples/standard-ml';
import VisualBasic from '../../../examples/visual-basic';
import VrPythonTestIdAndWrapping from '../../../examples/vr-python-test-id-and-wrapping';

const defaultColourThemeVariant: SnapshotTestOptions<Hooks> = {
	variants: [
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
};

snapshot(InlineCodeBasic, defaultColourThemeVariant);
snapshot(CodeBlockBasic, defaultColourThemeVariant);
snapshot(CodeBlockBasicWithTabs, defaultColourThemeVariant);
snapshot(Applescript, defaultColourThemeVariant);
snapshot(Clojure, defaultColourThemeVariant);
snapshot(Delphi, defaultColourThemeVariant);
snapshot(Diff, defaultColourThemeVariant);
snapshot(Foxpro, defaultColourThemeVariant);
snapshot(ObjectPascal, defaultColourThemeVariant);
snapshot(Qml, defaultColourThemeVariant);
snapshot(StandardMl, defaultColourThemeVariant);
snapshot(VisualBasic, defaultColourThemeVariant);
snapshot(CascadingStyleSheets, defaultColourThemeVariant);
snapshot(Handlebars, defaultColourThemeVariant);
snapshot(Jsx, defaultColourThemeVariant);
snapshot(CodeBlockEmpty, defaultColourThemeVariant);
snapshot(CodeBidiCharacters, defaultColourThemeVariant);
snapshot(CodeBlockHighlightingLongLines, defaultColourThemeVariant);
snapshot(VrPythonTestIdAndWrapping, defaultColourThemeVariant);
snapshot(CodeOverrideBackground, defaultColourThemeVariant);
snapshot(ExampleSQL, defaultColourThemeVariant);
snapshot(ExampleABAP, defaultColourThemeVariant);
snapshot(Gherkin, defaultColourThemeVariant);
