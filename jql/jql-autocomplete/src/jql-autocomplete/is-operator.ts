import { operators } from './constants';

export const isOperator: any = (maybeOperator: string): boolean =>
	operators.includes(maybeOperator);
