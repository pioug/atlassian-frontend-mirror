import chalk from 'chalk';

export const logger = {
  warn(message: string) {
    // eslint-disable-next-line no-console
    console.warn(chalk.yellow('WARNING'), message);
  },
  error(message: string) {
    // eslint-disable-next-line no-console
    console.error(chalk.red('ERROR'), message);
  },
};
