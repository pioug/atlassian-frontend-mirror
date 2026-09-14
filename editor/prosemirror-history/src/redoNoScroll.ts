import { buildCommand } from './buildCommand';
import type { Command } from './types';

/// A command function that redoes the last undone change. Don't
/// scroll the selection into view.
export const redoNoScroll: Command = buildCommand(true, false);
