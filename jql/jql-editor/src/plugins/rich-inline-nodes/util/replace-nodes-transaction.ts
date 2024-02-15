import { Node } from '@atlaskit/editor-prosemirror/model';
import { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import {
  AbstractJastVisitor,
  CompoundClause,
  Jast,
  ListOperand,
  NotClause,
  Query,
  TerminalClause,
  ValueOperand,
} from '@atlaskit/jql-ast';

import { JQLEditorSchema } from '../../../schema';
import { HydratedValuesMap } from '../../../state/types';
import { HydratedValue } from '../../../ui/jql-editor/types';
import getDocumentPosition from '../../common/get-document-position';
import { getJastFromState } from '../../jql-ast';
import { RICH_INLINE_NODE } from '../constants';

export const replaceRichInlineNodes = (
  editorState: EditorState,
  hydratedValues: HydratedValuesMap,
): Transaction => {
  const ast = getJastFromState(editorState);
  const transaction = editorState.tr;
  // Do not allow users to revert this transaction with undo command so they can't land in an unhydrated state
  transaction.setMeta('addToHistory', false);

  Object.entries(hydratedValues).forEach(([fieldName, values]) => {
    values.forEach(value => {
      if (value.type === 'user') {
        const astNodes = getValueNodes(ast, fieldName, value.id);
        astNodes.forEach(astNode => {
          if (astNode.position) {
            const [from, to] = astNode.position;
            const documentFrom = getDocumentPosition(transaction.doc, from);
            if (!isRichInlineNode(transaction.doc, documentFrom)) {
              const documentTo = getDocumentPosition(transaction.doc, to);
              const node = getRichInlineNode(fieldName, value, astNode.text);
              transaction.replaceWith(documentFrom, documentTo, node);
            }
          }
        });
      }
    });
  });

  return transaction;
};

const getRichInlineNode = (
  fieldName: string,
  value: HydratedValue,
  text: string,
) => {
  switch (value.type) {
    case 'user': {
      const textContent = JQLEditorSchema.text(text);
      return JQLEditorSchema.nodes.user.create(
        { ...value, fieldName },
        textContent,
      );
    }
    default: {
      throw new Error(`Unsupported hydrated value type ${value.type}`);
    }
  }
};

const isRichInlineNode = (doc: Node, position: number): boolean => {
  return doc.resolve(position).nodeAfter?.type.spec.group === RICH_INLINE_NODE;
};

const getValueNodes = (
  ast: Jast,
  field: string,
  value: string,
): ValueOperand[] => {
  if (!ast.query) {
    return [];
  }
  return ast.query.accept(new FindValuesVisitor(field, value));
};

class FindValuesVisitor extends AbstractJastVisitor<ValueOperand[]> {
  private readonly field: string;
  private readonly value: string;

  constructor(field: string, value: string) {
    super();
    this.field = field;
    this.value = value;
  }

  visitQuery = (query: Query): ValueOperand[] => {
    if (query.where === undefined) {
      return [];
    }
    return query.where.accept(this);
  };

  visitCompoundClause = (compoundClause: CompoundClause): ValueOperand[] => {
    return compoundClause.clauses.reduce((operands, compoundClause) => {
      return [...operands, ...compoundClause.accept(this)];
    }, [] as ValueOperand[]);
  };

  visitTerminalClause = (terminalClause: TerminalClause): ValueOperand[] => {
    if (terminalClause.field.value !== this.field) {
      return [];
    }
    if (terminalClause.operand === undefined) {
      return [];
    }
    return terminalClause.operand.accept(this);
  };

  visitNotClause = (notClause: NotClause): ValueOperand[] => {
    return notClause.clause.accept(this);
  };

  visitValueOperand = (valueOperand: ValueOperand): ValueOperand[] => {
    if (valueOperand.value !== this.value) {
      return [];
    }
    return [valueOperand];
  };

  visitListOperand = (listOperand: ListOperand): ValueOperand[] => {
    return listOperand.values.reduce((values, operand) => {
      return [...values, ...operand.accept(this)];
    }, [] as ValueOperand[]);
  };

  protected aggregateResult(
    aggregate: ValueOperand[],
    nextResult: ValueOperand[],
  ): ValueOperand[] {
    return [...aggregate, ...nextResult];
  }

  protected defaultResult(): ValueOperand[] {
    return [];
  }
}
