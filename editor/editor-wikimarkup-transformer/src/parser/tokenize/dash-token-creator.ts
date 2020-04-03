import { TextToken, TokenParser } from './';

export const createDashTokenParser = (
  token: TextToken,
  fallback: TextToken,
): TokenParser => ({ input, position }) => {
  /**
   * From Jira https://stash.atlassian.com/projects/JIRACLOUD/repos/jira/browse/jira-components/jira-renderer/src/main/java/com/atlassian/renderer/v2/components/phrase/DashRendererComponent.java
   *  public static final Replacer EN_DASH = new Replacer(Pattern.compile("(^|\\s)--(\\s|$)"), "$1&#8211;$2", "--");
   *  public static final Replacer EM_DASH = new Replacer(Pattern.compile("(^|\\s)---(\\s|$)"), "$1&#8212;$2", "---");
   */
  if (position > 0) {
    const charBeforeToken: string = input.charAt(position - 1);
    if (!isSpace(charBeforeToken)) {
      return fallback;
    }
  }

  if (position + token.length < input.length) {
    const charAfterToken: string = input.charAt(position + token.length);
    if (!isSpace(charAfterToken)) {
      return fallback;
    }
  }

  return token;
};

const isSpace = (char: string): boolean => {
  return /\s/.test(char);
};
