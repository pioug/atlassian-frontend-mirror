import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';

export default md`

  ${(<AtlassianInternalWarning />)}

  JQL Abstract Syntax Tree (JAST) is a json schema used to represent parsed JQL.

  ### Goals
  - A Jast from one platform should be re-usable as a Jast from another (Java ↔︎ JS ↔︎ iOS)
  - Contain enough information to render a rich JQL editing experience (e.g. Syntax highlighting)
  - Represent invalid and partially formed JQL (and contain detailed information on syntax errors)

  ### What Jast is not
  - Does not represent every detail appearing in the real syntax, but rather just the structural or content-related details (e.g. Parentheses are implicit in the tree structure so they are not included as nodes)
  - Does not contain any data specific to a individual Jira instance (besides the string of the original JQL query itself). Eg: no knowledge of available fields/users/values/operators
  - Syntax validation should not be performed on the Jast (this is done using the CST)
  - Autocomplete suggestions should not be populated using the Jast (this is done using the CST)

  ### Use cases
  - Syntax highlighting
  - Rendering errors

  ## Basic usage

  To generate an AST from a JQL string, you can use the \`JastBuilder\`.

  ${code`
import { JastBuilder, Jast } from "@atlaskit/jql-ast";

const someJqlQuery = 'issuetype = bug';
const myJast: Jast = new JastBuilder().build(someJqlQuery);
  `}

  Alternatively, to generate an AST from scratch (when you do not have a JQL string) you can use the \`jast\` creator.
  The creator does not depend on the ANTLR4 parser, which is a large library that can negatively impact your output bundle size.

  ${code`
import { creators, OPERATOR_EQUALS, Jast } from "@atlaskit/jql-ast";

// Equivalent JQL: project = PRJ
const myJast: Jast = creators.jast(
  creators.query(
    creators.terminalClause(
      creators.field('project'),
      creators.operator(OPERATOR_EQUALS),
      creators.valueOperand('PRJ'),
    ),
  )
);
  `}

  ## FAQ

  #### Why do we need an Abstact Syntaxt Tree (over the free CST)?

  ANTLR4 auto-generated parsers already generate a Concrete Syntax Tree from a JQL string. This tree is more detailed than
  the AST but otherwise VERY similar, why not just use that?

  The main reason is that the CST doesn’t immediately fulfill all of the listed goals above. But there are some other
  differences to mention:

  - The produced CST is not directly under our control, so updates to ANTLR4 syntax implementation only need to cause
    updates to the AST generator, no UI component updates necessary.
  - CST is not inherently serializable, but we can send a pre-parsed AST to be rendered early / in SSR without loading the
    whole parser and ANTLR4 runtime immediately.
  - Since we control creation of the AST, we can make logically consistent transformations to it without going through the
    parser again.
  - We can make sensible simplifications to the tree, e.g. combining ORDER BY into one terminal node instead of three,
    collapsing inactive notCompoundOperators, etc.

  ## Support

  For developers outside of Atlassian looking for help, or to report issues, [please make a post on the community forum](https://community.developer.atlassian.com/c/atlassian-ecosystem-design).
  We will monitor the forums and redirect topics to the appropriate maintainers.

`;
