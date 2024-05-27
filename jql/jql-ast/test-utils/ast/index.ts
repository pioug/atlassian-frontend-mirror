import {
  type AstNode,
  COMPOUND_OPERATOR_AND,
  COMPOUND_OPERATOR_OR,
  OPERAND_EMPTY,
  OPERATOR_CHANGED,
  OPERATOR_EQUALS,
  OPERATOR_GT,
  OPERATOR_IN,
  OPERATOR_IS,
  OPERATOR_IS_NOT,
  OPERATOR_WAS,
  OPERATOR_WAS_NOT,
  ORDER_BY_DIRECTION_ASC,
  ORDER_BY_DIRECTION_DESC,
  PREDICATE_OPERATOR_AFTER,
  PREDICATE_OPERATOR_DURING,
  PREDICATE_OPERATOR_FROM,
  PREDICATE_OPERATOR_TO,
} from '../../src';
import creators, { internalCreators } from '../../src/creators';

export const getStoryValueOperand = () => creators.valueOperand('story');
export const getEmptyKeywordOperand = () => creators.keywordOperand();
export const getAllFunctionOperand = () =>
  creators.functionOperand(creators.functionString('all'));

export const getInOperator = () => creators.operator(OPERATOR_IN);

export const getEpicAndTaskListOperand = () =>
  creators.listOperand([
    creators.valueOperand('epic'),
    creators.valueOperand('task'),
  ]);

export const getMockAstNode = (): AstNode => ({
  accept: jest.fn(),
  enterNode: jest.fn(),
  exitNode: jest.fn(),
  getChildren: jest.fn(() => []),
  position: null,
  parent: null,
});

export const getTypeEqualsBugClause = () =>
  creators.terminalClause(
    creators.field('issuetype'),
    creators.operator(OPERATOR_EQUALS),
    creators.valueOperand('bug'),
    [],
  );

export const getStatusEqualsOpenClause = () =>
  creators.terminalClause(
    creators.field('status'),
    creators.operator(OPERATOR_EQUALS),
    creators.valueOperand('open'),
    [],
  );

export const getAssigneeIsEmptyClause = () =>
  creators.terminalClause(
    creators.field('assignee'),
    creators.operator(OPERATOR_IS),
    creators.keywordOperand(),
    [],
  );

export const getEmptyTerminalClause = () =>
  creators.terminalClause(
    creators.field('issuetype'),
    creators.operator(OPERATOR_EQUALS),
    undefined,
    [],
  );

export const getCreatedRecentlyClause = () =>
  creators.terminalClause(
    creators.field('created'),
    creators.operator(OPERATOR_GT),
    creators.valueOperand('-1w'),
    [],
  );

export const getOrderByTypeField = () =>
  creators.orderByField(
    creators.field('issuetype'),
    creators.orderByDirection(ORDER_BY_DIRECTION_ASC),
  );
export const getOrderByStatusField = () =>
  creators.orderByField(
    creators.field('status'),
    creators.orderByDirection(ORDER_BY_DIRECTION_DESC),
  );
export const getOrderByAssigneeField = () =>
  creators.orderByField(creators.field('assignee'));

export const getCompoundAndClause = () =>
  creators.compoundClause(creators.compoundOperator(COMPOUND_OPERATOR_AND), [
    getTypeEqualsBugClause(),
    getStatusEqualsOpenClause(),
  ]);

export const getCompoundOrClause = () =>
  creators.compoundClause(creators.compoundOperator(COMPOUND_OPERATOR_OR), [
    getAssigneeIsEmptyClause(),
    getCreatedRecentlyClause(),
  ]);

export const jqlSimple = 'issuetype = bug';

export const jqlSimpleQuery = internalCreators.query(
  internalCreators.terminalClause(
    internalCreators.field('issuetype', 'issuetype', [], [0, 9]),
    internalCreators.operator(OPERATOR_EQUALS, '=', [10, 11]),
    internalCreators.valueOperand('bug', 'bug', [12, 15]),
    [],
    [0, 15],
  ),
  undefined,
  [0, 15],
);

export const jqlListOperand = 'resolution in (Duplicate, "Cannot Reproduce")';

export const jqlListOperandQuery = internalCreators.query(
  internalCreators.terminalClause(
    internalCreators.field('resolution', 'resolution', [], [0, 10]),
    internalCreators.operator(OPERATOR_IN, 'in', [11, 13]),
    internalCreators.listOperand(
      [
        internalCreators.valueOperand('Duplicate', 'Duplicate', [15, 24]),
        internalCreators.valueOperand(
          'Cannot Reproduce',
          '"Cannot Reproduce"',
          [26, 44],
        ),
      ],
      [14, 45],
    ),
    [],
    [0, 45],
  ),
  undefined,
  [0, 45],
);

export const jqlKeywordOperand = 'resolution is EMPTY';

export const jqlKeywordOperandQuery = internalCreators.query(
  internalCreators.terminalClause(
    internalCreators.field('resolution', 'resolution', [], [0, 10]),
    internalCreators.operator(OPERATOR_IS, 'is', [11, 13]),
    internalCreators.keywordOperand(OPERAND_EMPTY, [14, 19]),
    [],
    [0, 19],
  ),
  undefined,
  [0, 19],
);

export const jqlFunctionOperand = 'createdDate > startOfMonth(-1m)';

export const jqlFunctionOperandQuery = internalCreators.query(
  internalCreators.terminalClause(
    internalCreators.field('createdDate', 'createdDate', [], [0, 11]),
    internalCreators.operator(OPERATOR_GT, '>', [12, 13]),
    internalCreators.functionOperand(
      internalCreators.functionString('startOfMonth', 'startOfMonth', [14, 26]),
      [internalCreators.argument('-1m', '-1m', [27, 30])],
      [14, 31],
    ),
    [],
    [0, 31],
  ),
  undefined,
  [0, 31],
);

export const jqlCompoundClause =
  'project = T1 and issuetype = bug or project = T2';

export const jqlCompoundClauseQuery = internalCreators.query(
  internalCreators.compoundClause(
    internalCreators.compoundOperator(COMPOUND_OPERATOR_OR, [[33, 35]]),
    [
      internalCreators.compoundClause(
        internalCreators.compoundOperator(COMPOUND_OPERATOR_AND, [[13, 16]]),
        [
          internalCreators.terminalClause(
            internalCreators.field('project', 'project', [], [0, 7]),
            internalCreators.operator(OPERATOR_EQUALS, '=', [8, 9]),
            internalCreators.valueOperand('T1', 'T1', [10, 12]),
            [],
            [0, 12],
          ),
          internalCreators.terminalClause(
            internalCreators.field('issuetype', 'issuetype', [], [17, 26]),
            internalCreators.operator(OPERATOR_EQUALS, '=', [27, 28]),
            internalCreators.valueOperand('bug', 'bug', [29, 32]),
            [],
            [17, 32],
          ),
        ],
        [0, 32],
      ),
      internalCreators.terminalClause(
        internalCreators.field('project', 'project', [], [36, 43]),
        internalCreators.operator(OPERATOR_EQUALS, '=', [44, 45]),
        internalCreators.valueOperand('T2', 'T2', [46, 48]),
        [],
        [36, 48],
      ),
    ],
    [0, 48],
  ),
  undefined,
  [0, 48],
);

export const jqlChangedClause =
  'status changed from "To do" to "In progress" after -1w';

export const jqlChangedClauseQuery = internalCreators.query(
  internalCreators.terminalClause(
    internalCreators.field('status', 'status', [], [0, 6]),
    internalCreators.operator(OPERATOR_CHANGED, 'changed', [7, 14]),
    undefined,
    [
      internalCreators.predicate(
        internalCreators.predicateOperator(
          PREDICATE_OPERATOR_FROM,
          'from',
          [15, 19],
        ),
        internalCreators.valueOperand('To do', '"To do"', [20, 27]),
        [15, 27],
      ),
      internalCreators.predicate(
        internalCreators.predicateOperator(
          PREDICATE_OPERATOR_TO,
          'to',
          [28, 30],
        ),
        internalCreators.valueOperand('In progress', '"In progress"', [31, 44]),
        [28, 44],
      ),
      internalCreators.predicate(
        internalCreators.predicateOperator(
          PREDICATE_OPERATOR_AFTER,
          'after',
          [45, 50],
        ),
        internalCreators.valueOperand('-1w', '-1w', [51, 54]),
        [45, 54],
      ),
    ],
    [0, 54],
  ),
  undefined,
  [0, 54],
);

export const jqlWasClause = 'status was "To Do" during (-1w, now())';

export const jqlWasClauseQuery = internalCreators.query(
  internalCreators.terminalClause(
    internalCreators.field('status', 'status', [], [0, 6]),
    internalCreators.operator(OPERATOR_WAS, 'was', [7, 10]),
    internalCreators.valueOperand('To Do', '"To Do"', [11, 18]),
    [
      internalCreators.predicate(
        internalCreators.predicateOperator(
          PREDICATE_OPERATOR_DURING,
          'during',
          [19, 25],
        ),
        internalCreators.listOperand(
          [
            internalCreators.valueOperand('-1w', '-1w', [27, 30]),
            internalCreators.functionOperand(
              internalCreators.functionString('now', 'now', [32, 35]),
              [],
              [32, 37],
            ),
          ],
          [26, 38],
        ),
        [19, 38],
      ),
    ],
    [0, 38],
  ),
  undefined,
  [0, 38],
);

export const jqlOrderBy = 'order by createdDate desc, updatedDate asc, status';

export const jqlOrderByQuery = internalCreators.query(
  undefined,
  internalCreators.orderBy(
    [
      internalCreators.orderByField(
        internalCreators.field('createdDate', 'createdDate', [], [9, 20]),
        internalCreators.orderByDirection(ORDER_BY_DIRECTION_DESC, [21, 25]),
        [9, 25],
      ),
      internalCreators.orderByField(
        internalCreators.field('updatedDate', 'updatedDate', [], [27, 38]),
        internalCreators.orderByDirection(ORDER_BY_DIRECTION_ASC, [39, 42]),
        [27, 42],
      ),
      internalCreators.orderByField(
        internalCreators.field('status', 'status', [], [44, 50]),
        undefined,
        [44, 50],
      ),
    ],
    internalCreators.orderByOperator([0, 8]),
    [0, 50],
  ),
  [0, 50],
);

export const jqlMixedCasing =
  'RESOLUTION In (Duplicate, "Cannot Reproduce", eMPTy) aND sTatus Changed aFtEr -1w';

export const jqlMixedCasingQuery = internalCreators.query(
  internalCreators.compoundClause(
    internalCreators.compoundOperator(COMPOUND_OPERATOR_AND, [[53, 56]]),
    [
      internalCreators.terminalClause(
        internalCreators.field('RESOLUTION', 'RESOLUTION', [], [0, 10]),
        internalCreators.operator(OPERATOR_IN, 'In', [11, 13]),
        internalCreators.listOperand(
          [
            internalCreators.valueOperand('Duplicate', 'Duplicate', [15, 24]),
            internalCreators.valueOperand(
              'Cannot Reproduce',
              '"Cannot Reproduce"',
              [26, 44],
            ),
            internalCreators.keywordOperand(OPERAND_EMPTY, [46, 51]),
          ],
          [14, 52],
        ),
        [],
        [0, 52],
      ),
      internalCreators.terminalClause(
        internalCreators.field('sTatus', 'sTatus', [], [57, 63]),
        internalCreators.operator(OPERATOR_CHANGED, 'Changed', [64, 71]),
        undefined,
        [
          internalCreators.predicate(
            internalCreators.predicateOperator(
              PREDICATE_OPERATOR_AFTER,
              'aFtEr',
              [72, 77],
            ),
            internalCreators.valueOperand('-1w', '-1w', [78, 81]),
            [72, 81],
          ),
        ],
        [57, 81],
      ),
    ],
    [0, 81],
  ),
  undefined,
  [0, 81],
);

export const jqlMixedSpacing = `status was
not "To Do" and issuetype is   not empty`;

export const jqlMixedSpacingQuery = internalCreators.query(
  internalCreators.compoundClause(
    internalCreators.compoundOperator(COMPOUND_OPERATOR_AND, [[23, 26]]),
    [
      internalCreators.terminalClause(
        internalCreators.field('status', 'status', [], [0, 6]),
        internalCreators.operator(OPERATOR_WAS_NOT, 'was\nnot', [7, 14]),
        internalCreators.valueOperand('To Do', '"To Do"', [15, 22]),
        [],
        [0, 22],
      ),
      internalCreators.terminalClause(
        internalCreators.field('issuetype', 'issuetype', [], [27, 36]),
        internalCreators.operator(OPERATOR_IS_NOT, 'is   not', [37, 45]),
        internalCreators.keywordOperand('empty', [46, 51]),
        [],
        [27, 51],
      ),
    ],
    [0, 51],
  ),
  undefined,
  [0, 51],
);

export const jqlNotClause = `NOT ! (status = open AND NOT issuetype = bug)`;

export const jqlNotClauseQuery = internalCreators.query(
  internalCreators.notClause(
    internalCreators.notClause(
      internalCreators.compoundClause(
        internalCreators.compoundOperator(COMPOUND_OPERATOR_AND, [[21, 24]]),
        [
          internalCreators.terminalClause(
            internalCreators.field('status', 'status', [], [7, 13]),
            internalCreators.operator(OPERATOR_EQUALS, '=', [14, 15]),
            internalCreators.valueOperand('open', 'open', [16, 20]),
            [],
            [7, 20],
          ),
          internalCreators.notClause(
            internalCreators.terminalClause(
              internalCreators.field('issuetype', 'issuetype', [], [29, 38]),
              internalCreators.operator(OPERATOR_EQUALS, '=', [39, 40]),
              internalCreators.valueOperand('bug', 'bug', [41, 44]),
              [],
              [29, 44],
            ),
            internalCreators.notClauseOperator([25, 28]),
            [25, 44],
          ),
        ],
        [7, 44],
      ),
      internalCreators.notClauseOperator([4, 5]),
      [4, 45],
    ),
    internalCreators.notClauseOperator([0, 3]),
    [0, 45],
  ),
  undefined,
  [0, 45],
);

export const jqlEntityProperty = 'issue.property[tasks].completed = 1';

export const jqlEntityPropertyQuery = internalCreators.query(
  internalCreators.terminalClause(
    internalCreators.field(
      'issue.property',
      'issue.property',
      [
        internalCreators.property(
          internalCreators.argument('tasks', 'tasks', [15, 20]),
          [internalCreators.argument('.completed', '.completed', [21, 31])],
          [14, 31],
        ),
      ],
      [0, 31],
    ),
    internalCreators.operator(OPERATOR_EQUALS, '=', [32, 33]),
    internalCreators.valueOperand('1', '1', [34, 35]),
    [],
    [0, 35],
  ),
  undefined,
  [0, 35],
);

export const jqlQuotedStrings = `"Quoted \\"field\\"" in ('Value with \\'spaces\\'', "quotedFunction"("quotedArg")) order by "Another quoted" desc`;

export const jqlQuotedStringsQuery = internalCreators.query(
  internalCreators.terminalClause(
    internalCreators.field(
      'Quoted "field"',
      '"Quoted \\"field\\""',
      [],
      [0, 18],
    ),
    internalCreators.operator(OPERATOR_IN, 'in', [19, 21]),
    internalCreators.listOperand(
      [
        internalCreators.valueOperand(
          "Value with 'spaces'",
          "'Value with \\'spaces\\''",
          [23, 46],
        ),
        internalCreators.functionOperand(
          internalCreators.functionString(
            'quotedFunction',
            '"quotedFunction"',
            [48, 64],
          ),
          [internalCreators.argument('quotedArg', '"quotedArg"', [65, 76])],
          [48, 77],
        ),
      ],
      [22, 78],
    ),
    [],
    [0, 78],
  ),
  internalCreators.orderBy(
    [
      internalCreators.orderByField(
        internalCreators.field(
          'Another quoted',
          '"Another quoted"',
          [],
          [88, 104],
        ),
        internalCreators.orderByDirection(ORDER_BY_DIRECTION_DESC, [105, 109]),
        [88, 109],
      ),
    ],
    internalCreators.orderByOperator([79, 87]),
    [79, 109],
  ),
  [0, 109],
);
