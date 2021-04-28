/* eslint-disable no-console */
interface PrintedMapping {
  [key: string]: boolean;
}
const printed: PrintedMapping = {};

/**
 * Will only print a warning message in the console once per session
 *
 * @param message: The message to write as a waring
 */
export default function warnOnce(message: string) {
  if (printed[message]) {
    return;
  }

  printed[message] = true;

  if (typeof window !== 'undefined') {
    console.warn(message);
  }
}
