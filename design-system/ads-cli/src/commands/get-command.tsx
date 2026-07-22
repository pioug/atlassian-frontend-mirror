/**
 * Look up a command definition by name.
 */

import { commands } from './definitions';
import type { CommandDefinition } from './types';

/**
 * Look up a command definition by name. Returns `undefined` for unknown commands.
 */
export const getCommand = (name: string): CommandDefinition | undefined =>
	commands.find((command) => command.name === name);
