import { buildCommand } from './buildCommand';
import type { Command } from './types';

/// A command function that redoes the last undone change, if any.
export const redo: Command = buildCommand(true, true);
