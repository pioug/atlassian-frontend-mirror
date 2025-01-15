/**
 * Commented out for hot-114295
 */
export const noop = () => {};
// /**
//  * Code based on warning from @atlaskit/code
//  */
// import {
// 	EditorView as CodeMirror,
// 	ViewPlugin,
// 	ViewUpdate,
// 	Decoration,
// 	MatchDecorator,
// 	DecorationSet,
// 	WidgetType,
// } from '@codemirror/view';

// import { token } from '@atlaskit/tokens';

// const bidiCharacterRegex = /[\u202A-\u202E\u2066-\u2069]/gu;

// const placeholderMatcher = new MatchDecorator({
// 	regexp: bidiCharacterRegex,
// 	decoration: (match) =>
// 		Decoration.replace({
// 			widget: new PlaceholderWidget(match[0]),
// 		}),
// });

// export const bidiCharWarningExtension = ViewPlugin.fromClass(
// 	class {
// 		placeholders: DecorationSet;
// 		constructor(view: CodeMirror) {
// 			this.placeholders = placeholderMatcher.createDeco(view);
// 		}
// 		update(update: ViewUpdate) {
// 			this.placeholders = placeholderMatcher.updateDeco(update, this.placeholders);
// 		}
// 	},
// 	{
// 		decorations: (instance) => instance.placeholders,
// 		provide: (plugin) =>
// 			CodeMirror.atomicRanges.of((view) => {
// 				return view.plugin(plugin)?.placeholders || Decoration.none;
// 			}),
// 	},
// );

// function getBidiCharacterCode(bidiCharacter: string) {
// 	const bidiCharacterCode = bidiCharacter.codePointAt(0)?.toString(16);

// 	return `U+${bidiCharacterCode}`;
// }

// class PlaceholderWidget extends WidgetType {
// 	constructor(readonly name: string) {
// 		super();
// 	}
// 	eq(other: PlaceholderWidget) {
// 		return this.name === other.name;
// 	}
// 	toDOM() {
// 		const elt = document.createElement('span');
// 		elt.setAttribute('data-bidi-character-code', this.name);
// 		elt.style.cssText = `
//       padding: 0 3px;
//       color: ${token('color.text.warning')};
// 			background: ${token('color.background.warning')};
// 			aria-hidden="true"`;
// 		elt.textContent = `<${getBidiCharacterCode(this.name)}>`;
// 		return elt;
// 	}
// 	ignoreEvent() {
// 		return false;
// 	}
// }
