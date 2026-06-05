/* eslint-disable require-unicode-regexp -- Omit `u` so emitDeclarationOnly build (pre-ES2015 lib) does not error TS1501; patterns are ASCII-only paths and $/{ prefix. */
// Regular expression for a windows filepath in the format <DRIVE LETTER>:\<folder name>\
// Ignored via go/ees005
export const FILEPATH_REGEXP: RegExp =
	/([a-zA-Z]:|\\)([^\/:*?<>"|]+\\)?([^\/:*?<>"| ]+(?=\s?))?/gim;
