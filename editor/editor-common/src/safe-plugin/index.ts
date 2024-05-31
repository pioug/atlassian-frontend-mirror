import { Plugin } from '@atlaskit/editor-prosemirror/state';
import type { PluginSpec, SafePluginSpec } from '@atlaskit/editor-prosemirror/state';

// Wraper to avoid any exception during the get pos operation
// See this https://hello.atlassian.net/wiki/spaces/EDITOR/pages/2849713193/ED-19672+Extensions+Regression
// And this https://discuss.prosemirror.net/t/possible-bug-on-viewdesc-posbeforechild/5783
const wrapGetPosExceptions = <T extends SafePluginSpec>(spec: T): T => {
	if (!spec?.props?.nodeViews) {
		return spec;
	}

	const unsafeNodeViews = spec.props.nodeViews;
	const safeNodeViews = new Proxy(unsafeNodeViews, {
		get(target, prop, receiver) {
			const safeNodeView = new Proxy(Reflect.get(target, prop, receiver), {
				apply(target, thisArg, argumentsList) {
					const [node, view, unsafeGetPos, ...more] = argumentsList;

					const safeGetPos = (() => {
						try {
							return unsafeGetPos();
						} catch (e) {
							return;
						}

						return;
						// eslint-disable-next-line no-extra-bind
					}).bind(thisArg);

					return Reflect.apply(target, thisArg, [node, view, safeGetPos, ...more]);
				},
			});

			return safeNodeView;
		},
	});

	spec.props.nodeViews = safeNodeViews;

	return spec;
};

export class SafePlugin<T = any> extends Plugin<T> {
	// This variable isn't (and shouldn't) be used anywhere. Its purpose is
	// to distinguish Plugin from SafePlugin, thus ensuring that an 'unsafe'
	// Plugin cannot be assigned as an item in EditorPlugin → pmPlugins.
	_isATypeSafePlugin!: never;

	constructor(spec: SafePluginSpec<T>) {
		super(wrapGetPosExceptions(spec) as PluginSpec<T>);
	}
}
