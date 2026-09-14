import { buildCommand } from './buildCommand';
import type { Command } from './types';

/// A command function that undoes the last change, if any.
export const undo: Command = buildCommand(false, true);
