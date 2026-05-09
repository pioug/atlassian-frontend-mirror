// NOTE: The string values below intentionally duplicate the values of the
// matching `INPUT_METHOD` members in `@atlaskit/editor-common/analytics`
// (`TOOLBAR='toolbar'`, `KEYBOARD='keyboard'`, `EXTERNAL='external'`).
// Under TypeScript's `--isolatedDeclarations`, enum member initializers cannot
// reference external symbols (TS9020), so we cannot write
// `TOOLBAR = INPUT_METHOD.TOOLBAR`. If you change a value here, update the
// corresponding `INPUT_METHOD` member to match — these strings are written
// straight into transaction meta in `attach-input-meta.ts` and surface as
// the `historyTriggerMethod` analytics attribute (asserted in
// `editor-plugin-undo-redo-tests/.../analytics-input-method.ts`).

export enum InputSource {
	TOOLBAR = 'toolbar',
	KEYBOARD = 'keyboard',
	EXTERNAL = 'external',
}
