import { nativeEmbedAlignmentStyles } from '../native-embed-styles';

describe('nativeEmbedAlignmentStyles', () => {
	it('contains resized embeds in both old and new panel structures when containment is enabled', () => {
		const styles = nativeEmbedAlignmentStyles.styles;

		expect(styles).toContain(
			'.ProseMirror .ak-editor-panel .extension-container:not(:has([data-native-tabs])):has([data-native-embed-panel-resize-containment="true"])',
		);
		expect(styles).toContain(
			'.ProseMirror .ak-editor-panel__content .extension-container:not(:has([data-native-tabs])):has([data-native-embed-panel-resize-containment="true"])',
		);
		expect(styles).toContain(
			'.fabric-editor--full-width-mode:not(:has(#chromeless-editor)) .ak-editor-panel .extension-container:not(:has([data-native-tabs])).block:has([data-native-embed-panel-resize-containment="true"])',
		);
		expect(styles).toContain(
			'.fabric-editor--full-width-mode:not(:has(#chromeless-editor)) .ak-editor-panel__content .extension-container:not(:has([data-native-tabs])).block:has([data-native-embed-panel-resize-containment="true"])',
		);
		expect(styles).toContain('width:auto !important');
		expect(styles).toContain('max-width:var(--native-embed-width) !important');
	});

	it('leaves centring of wide and full-width renderer embeds to the flex wrapper', () => {
		const styles = nativeEmbedAlignmentStyles.styles;

		expect(styles).toContain(
			'.ak-renderer-flex-center-wrapper > .ak-renderer-extension:not(:has([data-native-tabs])):has([data-native-embed-alignment="center"][data-native-embed-wide-layout-centering="true"]){left:auto;transform:none;}',
		);
	});
});
