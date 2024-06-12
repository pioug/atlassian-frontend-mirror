import path from 'path';

/**
 * Manually import presets to make sure typescript includes them
 * in the final bundle.
 */
import './styled-to-emotion/styled-to-emotion';
import './theme-remove-deprecated-mixins/theme-remove-deprecated-mixins';
import './migrate-to-new-buttons/migrate-to-new-buttons';
import './upgrade-pragmatic-drag-and-drop-to-stable/upgrade-pragmatic-drag-and-drop-to-stable';

const presets = [
	'styled-to-emotion',
	'theme-remove-deprecated-mixins',
	'migrate-to-new-buttons',
	'upgrade-pragmatic-drag-and-drop-to-stable',
].map((preset) => path.join(__dirname, preset, `${preset}.@(ts|js|tsx)`));

export default presets;
