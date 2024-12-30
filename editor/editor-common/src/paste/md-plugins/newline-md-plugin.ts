// File has been copied to packages/editor/editor-plugin-ai/src/provider/markdown-transformer/md/newline-md-plugin.ts
// If changes are made to this file, please make the same update in the linked file.

// ED-15363: modified version of the original newline plugin
// https://github.com/markdown-it/markdown-it/blob/master/lib/rules_inline/newline.js
// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const newline = (state: any, silent: boolean) => {
	let pos = state.pos;
	// ED-15363: unread variables
	// max,
	// ws,

	if (state.src.charCodeAt(pos) !== 0x0a /* \n */) {
		return false;
	}

	const pmax = state.pending.length - 1;
	// ED-15363: unread variable
	// max = state.posMax;

	// '  \n' -> hardbreak
	// Lookup in pending chars is bad practice! Don't copy to other rules!
	// Pending string is stored in concat mode, indexed lookups will cause
	// convertion to flat mode.
	if (!silent) {
		if (pmax >= 0 && state.pending.charCodeAt(pmax) === 0x20) {
			if (pmax >= 1 && state.pending.charCodeAt(pmax - 1) === 0x20) {
				// ED-15363: We commented out this logic to preserve trailing whitespaces
				// for each line of text when pasting plain text

				// // Find whitespaces tail of pending chars.
				// ws = pmax - 1;
				// while (ws >= 1 && state.pending.charCodeAt(ws - 1) === 0x20) {
				//   ws--;
				// }
				// state.pending = state.pending.slice(0, ws);
				state.push('hardbreak', 'br', 0);
			} else {
				state.pending = state.pending.slice(0, -1);
				state.push('softbreak', 'br', 0);
			}
		} else {
			state.push('softbreak', 'br', 0);
		}
	}

	pos++;

	// ED-15363: We commented out this logic from the original library to
	// preserve leading whitespaces for each line of text when pasting plain
	// text (to preserve whitespace-based indentation).

	// // skip heading spaces for next line
	// while (pos < max && isSpace(state.src.charCodeAt(pos))) {
	//   pos++;
	// }

	state.pos = pos;
	return true;
};

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (md: any) => md.inline.ruler.at('newline', newline);
