import { _getCopyButtonTestSuite } from '../copy-button/_getCopyButtonTestSuite';

import fullWidthExtensionADF from './__fixtures__/full-width-extension-inside-bodied-extension.adf.json';

_getCopyButtonTestSuite({
	nodeName: 'Extension',
	editorOptions: {
		allowExtension: true,
		defaultValue: fullWidthExtensionADF,
	},

	// prosemirror-bump-fix
	// ProseMirror now is dealing better with clicks inside nested content
	// So, this change is to make sure the node clicked is the first extension and not the internal one
	nodeSelector: '.extension-container [aria-label="bodied-eh"]',
});
