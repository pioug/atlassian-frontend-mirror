/**
 * Human-readable rendering of a command error.
 */

import chalk from 'chalk';

import type { Writer } from './writer';

/**
 * Emit a human-readable error to stderr.
 */
export const writeHumanError = ({ message, writer }: { message: string; writer: Writer }): void => {
	writer.err(chalk.red(`Error: ${message}`));
};
