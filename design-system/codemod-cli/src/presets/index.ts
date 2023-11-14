import path from 'path';

/**
 * Manually import presets to make sure typescript includes them
 * in the final bundle
 */
import './styled-to-emotion/styled-to-emotion';
import './theme-to-design-tokens/theme-to-design-tokens';
import './theme-remove-deprecated-mixins/theme-remove-deprecated-mixins';
import './css-to-design-tokens/css-to-design-tokens';
import './migrate-to-new-buttons/migrate-to-new-buttons';

const presets = [
  'styled-to-emotion',
  'theme-to-design-tokens',
  'theme-remove-deprecated-mixins',
  'css-to-design-tokens',
  'migrate-to-new-buttons',
].map((preset) => path.join(__dirname, preset, `${preset}.@(ts|js|tsx)`));

export default presets;
