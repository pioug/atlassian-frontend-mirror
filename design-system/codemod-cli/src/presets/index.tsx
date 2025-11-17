import path from 'path';

/**
 * Manually import presets to make sure typescript includes them
 * in the final bundle.
 */
import './styled-to-emotion/styled-to-emotion';
import './theme-remove-deprecated-mixins/theme-remove-deprecated-mixins';
import './migrate-to-link/migrate-to-link';
import './migrate-to-new-buttons/migrate-to-new-buttons';
import './migrate-icon-object-to-object/migrate-icon-object-to-object';
import './upgrade-pragmatic-drag-and-drop-to-stable/upgrade-pragmatic-drag-and-drop-to-stable';
import './remove-dark-theme-vr-options/remove-dark-theme-vr-options';
import './remove-token-fallbacks/remove-token-fallbacks';
import './lozenge-appearance-semantic-migration/lozenge-appearance-semantic-migration';
import './lozenge-to-tag-migration/lozenge-to-tag-migration';

const presets = [
	'styled-to-emotion',
	'theme-remove-deprecated-mixins',
	'migrate-to-link',
	'migrate-to-new-buttons',
	'migrate-icon-object-to-object',
	'upgrade-pragmatic-drag-and-drop-to-stable',
	'remove-dark-theme-vr-options',
	'remove-token-fallbacks',
	'lozenge-appearance-semantic-migration',
	'lozenge-to-tag-migration',
].map((preset) => path.join(__dirname, preset, `${preset}.@(ts|js|tsx)`));

export default presets;
