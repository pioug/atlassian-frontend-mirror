import { code, md } from '@atlaskit/docs';

export default md`

  Consumers can generate a formatted JQL string from an AST object using the print API. This is particularly useful in
  conjunction with the [transformation API](https://atlaskit.atlassian.com/packages/jql/jql-ast/docs/transforming-the-ast)
  to modify a tree and print the resulting output.

  Usage is simple:

  ${code`
import { creators, print, JastBuilder, OPERATOR_EQUALS, COMPOUND_OPERATOR_AND } from '@atlaskit/jql-ast';

const input = 'status = open';
const jast = new JastBuilder().build(input);

const newClause = creators.terminalClause(
    creators.field('assignee'),
    creators.operator(OPERATOR_EQUALS),
    creators.functionOperand(creators.functionString('currentUser'))
);
jast.query?.appendClause(newClause, COMPOUND_OPERATOR_AND);

console.log(print(jast));
// Outputs: status = open and assignee = currentUser()
  `}

  You can also ask the printer to use upper, lower or preserve case of operators in the printed JQL.


  ${code`
import { creators, print, JastBuilder, OPERATOR_EQUALS, COMPOUND_OPERATOR_AND } from '@atlaskit/jql-ast';

const input = 'status in (open, closed) order by created DESC';
const jast = new JastBuilder().build(input);

const newClause = creators.terminalClause(
    creators.field('assignee'),
    creators.operator(OPERATOR_EQUALS),
    creators.functionOperand(creators.functionString('currentUser'))
);
jast.query?.appendClause(newClause, COMPOUND_OPERATOR_AND);

console.log(print(jast, { operatorCase: 'upper' }));
// Outputs: status IN (open, closed) AND assignee = currentUser() ORDER BY created DESC
  `}
`;
