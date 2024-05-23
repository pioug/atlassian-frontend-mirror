import { type RuleConfig } from './types';

/**
 * ESLint rules should NEVER throw exceptions, because that breaks the VSCode ESLint server
 * (and probably the IntelliJ one too), which causes linting to fail in a file.
 *
 * It also breaks CI, which was the reason this error boundary was added. It's a final
 * catch all.
 */
export const errorBoundary = (
  func: () => void,
  { config }: { config: RuleConfig },
) => {
  try {
    func();
  } catch (err) {
    if (!config.failSilently) {
      // eslint-disable-next-line no-console
      console.warn(err);
    }
  }
};
