import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';

export default md`

  ${(<AtlassianInternalWarning />)}

  This package allows consumers to retrieve autocomplete suggestions for a given JQL query. JQL
  Autocomplete leverages the [antlr4-c3](https://github.com/mike-lischke/antlr4-c3) library to provide
  code completion candidates using the ANTLR4 generated \`@atlaskit/jql-parser\`. Refer to
  [antlr4-c3](https://github.com/mike-lischke/antlr4-c3) for a more in-depth introduction into code
  completion with ANTLR4 grammars.

  ## Usage

  For a simple use case you'll want to construct a new \`JQLAutocomplete\` object for a given source query.

  ${code`
import { JQLAutocomplete } from '@atlaskit/jql-autocomplete';

const autocomplete = JQLAutocomplete.fromText("assignee = currentUser()");
  `}

  You can then specify the (zero-indexed) caret position to retrieve suggestions for, e.g.:

  ${code`
// Caret positioned at "assignee = "
const selectionStart = 11;
const selectionStop = 11;
const suggestions = autocomplete.getJQLSuggestionsForCaretPosition([
  selectionStart,
  selectionStop,
]);

console.log(suggestions);
  `}

  Will output the following response:

    ${code`
{
  "tokens": {
    "matchedText": "",
    "replacePosition": [11,11],
    "values": ["EMPTY"]
  },
  "rules": {
    "function": {
      "matchedText": "",
      "replacePosition": [11,11],
      "context": {
        "field": "assignee",
        "operator": "="
      }
    },
    "value": {
      "matchedText": "",
      "replacePosition": [11,11],
      "context": {
        "field": "assignee",
        "operator": "="
      }
    }
  }
}
  `}

  This includes a collection of [tokens](https://github.com/antlr/antlr4/blob/master/doc/lexer-rules.md#lexer-rules)
  and [rules](https://github.com/antlr/antlr4/blob/master/doc/parser-rules.md) that are valid for the
  given caret position. Rules are essential for deriving more than just keywords from your
  autocomplete.

  As you can see in the above example a valid query could be produced using:
  - An \`EMPTY\` token, e.g. \`assignee = EMPTY\`
  - A \`function\` rule, e.g. \`assignee = currentUser()\`
  - A \`value\` rule, e.g. \`assignee = xxxxxxxxx\`

  Typically, when encountering rules you'll want to enrich this information with Jira data. To do so
  you can leverage [Jira Cloud REST API's](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-jql/).

  ## Documentation

  ### Fine tuning

  When constructing an autocomplete object you can specify a collection of \`ignoredTokens\` and
  \`preferredRules\`. When not provided, the autocomplete engine specified default arguments which are
  suitable for most autocomplete use cases. You can read more about these options in the
  [antlr4-c3 documentation](https://github.com/mike-lischke/antlr4-c3#fine-tuning).

  We also extend the \`antlr4-c3\` configuration options with a new argument, \`delimiterTokens\`. By
  default \`JQLAutocomplete\` will provide suggestions for the token immediately preceding the caret.
  When the caret is positioned at a delimiter token then we'll look for suggestions **after** the
  current token.

  For example:

    ${code`
import { JQLLexer, JQLParser } from '@atlaskit/jql-parser';
import { JQLAutocomplete } from '@atlaskit/jql-autocomplete';

const ignoredTokens = new Set([JQLLexer.NOT_EQUALS]); // Exclude != tokens from suggestions
const preferredRules = new Set([JQLParser.RULE_jqlField]) // Only show rule suggestions for fields
const delimiterTokens = new Set([JQLLexer.COMMA]) // Give suggestions for tokens AFTER commas

const autocomplete = JQLAutocomplete.fromText("assignee = currentUser()", ignoredTokens, preferredRules, delimiterTokens);
  `}

  ## Support

  For developers outside of Atlassian looking for help, or to report issues, [please make a post on the community forum](https://community.developer.atlassian.com/c/atlassian-ecosystem-design).
  We will monitor the forums and redirect topics to the appropriate maintainers.

`;
