import { type Hooks, snapshot, type SnapshotTestOptions } from '@af/visual-regression';

import InlineCodeBasic from '../../../examples/01-inline-code-basic.vr.ap';
import CodeBlockBasic from '../../../examples/10-code-block-basic.vr.ap';
import CodeBlockBasicWithTabs from '../../../examples/11-code-block-basic-with-tabs.vr.ap';
import CodeBlockHighlightingLongLines from '../../../examples/14-code-block-highlighting-long-lines.vr.ap';
import CodeBlockEmpty from '../../../examples/21-code-block-empty.vr.ap';
import CodeBidiCharacters from '../../../examples/22-code-bidi-characters.vr.ap';
import CodeOverrideBackground from '../../../examples/23-code-override-background.vr.ap';
import ExampleABAP from '../../../examples/abap.vr.ap';
import Applescript from '../../../examples/applescript.vr.ap';
import CascadingStyleSheets from '../../../examples/cascading-style-sheets.vr.ap';
import Clojure from '../../../examples/clojure.vr.ap';
import Delphi from '../../../examples/delphi.vr.ap';
import Diff from '../../../examples/diff.vr.ap';
import Foxpro from '../../../examples/foxpro.vr.ap';
import Gherkin from '../../../examples/gherkin.vr.ap';
import Handlebars from '../../../examples/handlebars.vr.ap';
import Jsx from '../../../examples/jsx.vr.ap';
import MarkdownFencedCodeJsx from '../../../examples/markdown-fenced-code-jsx.vr.ap';
import ObjectPascal from '../../../examples/object-pascal.vr.ap';
import Qml from '../../../examples/qml.vr.ap';
import ExampleSQL from '../../../examples/sql.vr.ap';
import StandardMl from '../../../examples/standard-ml.vr.ap';
import Toml from '../../../examples/toml.vr.ap';
import VisualBasic from '../../../examples/visual-basic.vr.ap';
import VrPythonTestIdAndWrapping from '../../../examples/vr-python-test-id-and-wrapping.vr.ap';

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
snapshot(Toml, defaultColourThemeVariant);

// Markdown fenced code: gate ON — HTML/JSX tags preserved + inner tokens highlighted
snapshot(MarkdownFencedCodeJsx, {
	variants: [
		{
			name: 'light mode markdown safe gate on',
			environment: {
				colorScheme: 'light',
			},
		},
	],
	featureFlags: {
		'platform-code-highlight-markdown-safe': true,
	},
});

// Markdown fenced code: gate OFF — HTML/JSX tags lost
snapshot(MarkdownFencedCodeJsx, {
	variants: [
		{
			name: 'light mode markdown safe gate off',
			environment: {
				colorScheme: 'light',
			},
		},
	],
	featureFlags: {
		'platform-code-highlight-markdown-safe': false,
	},
});
