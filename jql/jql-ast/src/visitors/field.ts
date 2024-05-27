import {
  type JqlFieldPropertyContext,
  type JqlNonNumberFieldContext,
  type JqlNumberFieldContext,
  type JqlPropertyArgumentContext,
} from '@atlaskit/jql-parser';

import { internalCreators } from '../creators';
import { type Argument, type Field, type Property } from '../types';

import { ArgumentVisitor } from './argument';
import { getPositionFromContext, JastBuildingVisitor } from './common';
import { StringVisitor } from './string';

export class FieldVisitor extends JastBuildingVisitor<Field> {
  stringVisitor = new StringVisitor(this.tokens);
  fieldPropertyVisitor = new FieldPropertyVisitor(this.tokens);

  visitJqlNumberField = (ctx: JqlNumberFieldContext): Field => {
    const text = this.tokens.getText(ctx);
    return internalCreators.field(
      text,
      text,
      undefined,
      getPositionFromContext(ctx),
    );
  };

  visitJqlNonNumberField = (ctx: JqlNonNumberFieldContext): Field => {
    const stringContext = ctx.jqlString();

    const properties = ctx
      .jqlFieldProperty()
      .map(context => context.accept(this.fieldPropertyVisitor));

    if (stringContext !== undefined) {
      const stringValue = stringContext.accept(this.stringVisitor);
      return internalCreators.field(
        stringValue.value,
        stringValue.text,
        properties,
        getPositionFromContext(ctx),
      );
    }

    const text = this.tokens.getText(ctx);
    return internalCreators.field(
      text,
      text,
      properties,
      getPositionFromContext(ctx),
    );
  };
}

class FieldPropertyVisitor extends JastBuildingVisitor<Property> {
  argumentVisitor = new ArgumentVisitor(this.tokens);
  propertyArgumentVisitor = new PropertyArgumentVisitor(this.tokens);

  visitJqlFieldProperty = (ctx: JqlFieldPropertyContext): Property => {
    const argumentContext = ctx.jqlArgument();
    const propertyArgumentContext = ctx.jqlPropertyArgument();

    const path = propertyArgumentContext.map<Argument>(context =>
      context.accept(this.propertyArgumentVisitor),
    );

    return internalCreators.property(
      argumentContext && argumentContext.accept(this.argumentVisitor),
      path,
      getPositionFromContext(ctx),
    );
  };
}

class PropertyArgumentVisitor extends JastBuildingVisitor<Argument> {
  argumentVisitor = new ArgumentVisitor(this.tokens);

  visitJqlPropertyArgument = (ctx: JqlPropertyArgumentContext): Argument => {
    return ctx.jqlArgument().accept(this.argumentVisitor);
  };
}
