import BASE_CSS from '@atlaskit/css-reset/base';
import BROWSER_FIXES_CSS from '@atlaskit/css-reset/browser-fixes';
import RESET_CSS from '@atlaskit/css-reset/reset';
import TABLES_CSS from '@atlaskit/css-reset/tables';
import UTILS_CSS from '@atlaskit/css-reset/utils';

const IFRAME_FIX_CSS = `
  html{
    width: calc(100% - 10px);
    padding: 5px;
    overflow: hidden;
    height: auto;
  }

  body {
    margin: 0;
    padding: 0;
  }`;

const DEFAULT_CSS =
  RESET_CSS +
  BASE_CSS +
  UTILS_CSS +
  BROWSER_FIXES_CSS +
  BROWSER_FIXES_CSS +
  TABLES_CSS +
  IFRAME_FIX_CSS;

export default DEFAULT_CSS;
