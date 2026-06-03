import { DOMParser as PMDOMParser } from '@atlaskit/editor-prosemirror/model';
import type { ParseRule, Schema } from '@atlaskit/editor-prosemirror/model';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

/**
 * Builds additional parseDOM rules to inject into the clipboard parser.
 *
 * Adding a rule with a higher priority than the default schema rules, allows
 * specific HTML patterns to be parsed as a different node type than the schema
 * would normally choose.
 */
function buildAdditionalClipboardParseRules(schema: Schema): ParseRule[] {
	const rules: ParseRule[] = [];

	// This means that panels with tables inside always stay as panel_c1,
	// but panels without tables retain standard behaviour
	// of choosing between panel_c1 and panel depending on the context.
	// e.g. panel with table pasted in expand gets lifted out, panel with normal text gets pasted inside expand
	const { panel_c1, panel } = schema.nodes;

	if (!panel_c1 || !panel) {
		return rules;
	}

	const panelGetAttrs = panel.spec.parseDOM?.[0]?.getAttrs;

	rules.push({
		tag: 'div[data-panel-type]',
		priority: 60,
		node: panel_c1.name,
		getAttrs: (dom: HTMLElement) => {
			const hasTable = dom.querySelector('[data-prosemirror-node-name="table"]') !== null;
			if (!hasTable) {
				return false; // fall through to standard panel rule
			}
			return panelGetAttrs ? panelGetAttrs(dom) : null;
		},
	});

	return rules;
}

/**
 * Creates a ProseMirror plugin with a custom `clipboardParser` that extends the
 * schema's default parser with additional rules for handling specific paste scenarios.
 */
export function createClipboardParser(schema: Schema): PMDOMParser | undefined {
	if (!expValEquals('platform_editor_nest_table_in_panel', 'isEnabled', true)) {
		return undefined;
	}

	const additionalRules = buildAdditionalClipboardParseRules(schema);

	const baseParser = PMDOMParser.fromSchema(schema);
	const customParser = new PMDOMParser(schema, [...additionalRules, ...baseParser.rules]);

	return customParser;
}
