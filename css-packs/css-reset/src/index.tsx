import accessibility from './accessibility';
import baseStyles from './base';
import browserFixesStyles from './browser-fixes';
import resetStyles from './reset';
import tableStyles from './tables';
import utilStyles from './utils';

export default `
${resetStyles}
${baseStyles}
${tableStyles}
${browserFixesStyles}
${utilStyles}
${accessibility}
`;
