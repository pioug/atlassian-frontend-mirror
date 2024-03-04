import type { Rule } from 'eslint';
import type { Property, SpreadElement } from 'eslint-codemod-utils';

const ObjectEntry = {
  deleteEntry(
    node: Property | SpreadElement,
    context: Rule.RuleContext,
    fixer: Rule.RuleFixer,
  ): Rule.Fix {
    // context.getSourceCode() is deprecated in favour of context.sourceCode, however this returns undefined for some reason
    const sourceCode = context.getSourceCode();

    // fixer.remove() doesn't account for things like commas or newlines within an ObjectExpression and will result in invalid output.
    // This approach specifically removes the node and trailing comma, and should work for single- and multi-line objects.
    // From https://github.com/eslint/eslint/issues/9576#issuecomment-341737453
    let prevToken = sourceCode.getTokenBefore(node);
    while (prevToken?.value !== ',' && prevToken?.value !== '{') {
      prevToken = sourceCode.getTokenBefore(node);
    }
    let lastToken = sourceCode.getTokenAfter(node);
    if (lastToken?.value !== ',') {
      lastToken = sourceCode.getTokenBefore(lastToken!);
    }

    return fixer.removeRange([prevToken.range[1], lastToken!.range[1]]);
  },
};

export { ObjectEntry };
