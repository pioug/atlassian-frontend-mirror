import { rankEditorPlugins } from './rankEditorPlugins';

// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
// @deprecated
// @private This rank is not stable and should not be trusted. If you need to change this file, please let the Editor lego team know about it
export function sortByOrder(item: 'plugins' | 'nodes' | 'marks') {
	return function (a: { name: string }, b: { name: string }): number {
		return rankEditorPlugins[item].indexOf(a.name) - rankEditorPlugins[item].indexOf(b.name);
	};
}

// while functionally the same, in order to avoid potentially rewriting the ~10
// existing implementations of the above function I decided creating a separate
// function avoided that whole mess. If someone can think of a better way to implement
// the above and below into a single function please do so

// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
// @deprecated
// @private This rank is not stable and should not be trusted. If you need to change this file, please let the Editor lego team know about it
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function sortByOrderWithTypeName(item: 'plugins' | 'nodes' | 'marks') {
	return function (a: { type: { name: string } }, b: { type: { name: string } }): number {
		return (
			rankEditorPlugins[item].indexOf(a.type.name) - rankEditorPlugins[item].indexOf(b.type.name)
		);
	};
}
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { rankEditorPlugins } from './rankEditorPlugins';
