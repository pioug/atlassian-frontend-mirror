import { type JqlArgumentContext } from '@atlaskit/jql-parser';

import { internalCreators } from '../creators';
import { type Argument } from '../types';

import { getPositionFromContext, JastBuildingVisitor } from './common';
import { StringVisitor } from './string';

export class ArgumentVisitor extends JastBuildingVisitor<Argument> {
  stringVisitor = new StringVisitor(this.tokens);

  visitJqlArgument = (ctx: JqlArgumentContext): Argument => {
    const stringContext = ctx.jqlString();
    if (stringContext !== undefined) {
      const stringValue = stringContext.accept(this.stringVisitor);
      return internalCreators.argument(
        stringValue.value,
        stringValue.text,
        stringValue.position,
      );
    } else {
      const text = this.tokens.getText(ctx);
      return internalCreators.argument(text, text, getPositionFromContext(ctx));
    }
  };
}
