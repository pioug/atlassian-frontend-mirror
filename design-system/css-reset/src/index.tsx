import baseStyles from './base';
import browserFixesStyles from './browser-fixes';
import resetStyles from './reset';
import tableStyles from './tables';
import utilStyles from './utils';

const styleSheet = `
${resetStyles}
${baseStyles}
${tableStyles}
${browserFixesStyles}
${utilStyles}
`;

export default styleSheet;
