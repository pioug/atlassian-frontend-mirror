import { buildCommand } from './buildCommand';
import type { Command } from './types';

/// A command function that undoes the last change. Don't scroll the
/// selection into view.
export const undoNoScroll: Command = buildCommand(false, false);
