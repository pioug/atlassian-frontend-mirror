/* eslint-disable no-console */

type AGENT = 'cursor' | 'vscode' | 'rovodev' | 'codelassian' | string;

export const agent: AGENT = (process.env.ADSMCP_AGENT as AGENT) || 'unknown';
