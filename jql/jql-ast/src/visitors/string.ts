import { JqlStringContext } from '@atlaskit/jql-parser';

import { StringValue } from '../types';

import { getPositionFromContext, JastBuildingVisitor } from './common';

export class StringVisitor extends JastBuildingVisitor<StringValue> {
  visitJqlString = (ctx: JqlStringContext): StringValue => {
    const text = this.tokens.getText(ctx);
    const position = getPositionFromContext(ctx);

    let value;
    if (ctx.QUOTE_STRING()) {
      value = text.replace(/^"|"$/g, '').replace(/(?:\\(.))/g, '$1');
    } else if (ctx.SQUOTE_STRING()) {
      value = text.replace(/^'|'$/g, '').replace(/(?:\\(.))/g, '$1');
    } else {
      // unquoted string
      value = text;
    }

    return {
      text,
      value,
      position,
    };
  };
}
