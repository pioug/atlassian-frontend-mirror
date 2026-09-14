import { type ParserRuleContext } from 'antlr4ts/ParserRuleContext';

import { type Position } from '../common/types';

export const getPositionFromParserRule: any = (ctx: ParserRuleContext): Position => [
	ctx.start.startIndex,
	ctx.stop ? ctx.stop.stopIndex + 1 : ctx.start.stopIndex + 1,
];
