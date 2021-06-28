import { exec } from 'child_process';
import { promisify } from 'util';
import { PrintableOutput } from '../runner';

const pexec = promisify(exec);

export function add(filePath: string) {
  return pexec(`git add ${filePath}`);
}

export function indent(text: string, level: number = 1) {
  return `${('' as any).padStart(level * 2, ' ')}${text}`;
}

export function processPrintableOutput(
  printable: PrintableOutput,
  level: number = 0,
) {
  return (Array.isArray(printable) ? printable : [printable]).reduce<
    Array<string>
  >((acc, item) => {
    if (Array.isArray(item)) {
      acc.push(...processPrintableOutput(item, level + 1));
    } else {
      acc.push(indent(item, level));
    }
    return acc;
  }, []);
}

export function commit(title: string, msg: PrintableOutput) {
  let msgByLine =
    '-m ' +
    processPrintableOutput(msg)
      .map((line) => `"${line}"`)
      .join(' -m ');
  return pexec(`git commit -m "${title}" ${msgByLine}`);
}
