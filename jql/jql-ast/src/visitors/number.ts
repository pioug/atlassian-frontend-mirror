import { type JqlNumberContext } from '@atlaskit/jql-parser';

import { internalCreators } from '../creators';
import { type ValueOperand } from '../types';

import { getPositionFromContext, JastBuildingVisitor } from './common';

export class NumberVisitor extends JastBuildingVisitor<ValueOperand> {
	visitJqlNumber = (ctx: JqlNumberContext): ValueOperand => {
		const text = this.tokens.getText(ctx);
		return internalCreators.valueOperand(text, text, getPositionFromContext(ctx));
	};
}
