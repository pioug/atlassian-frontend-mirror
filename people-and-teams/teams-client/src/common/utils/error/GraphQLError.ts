import { CommonError } from './CommonError';

import type { ErrorData } from './index';

// Graphql Errors
interface ResultErrorData {
	category: string;
	message: string;
	fields?: object;
}

export class GraphQLError extends CommonError {
	fields?: any; // tslint:disable-line no-any
	category?: string;

	constructor({ message, category = 'default', fields }: Partial<ResultErrorData>) {
		super(message);
		Object.setPrototypeOf(this, GraphQLError.prototype);

		this.category = category;

		if (fields) {
			this.fields = fields;
		}
	}

	static from = (rawErrors: ErrorData[]): GraphQLError => {
		const firstError = rawErrors[0];

		const errorData: ResultErrorData = {
			category: firstError.category,
			message: firstError.message,
		};

		if (firstError.fields) {
			errorData.fields = firstError.fields.reduce<Record<string, string>>((obj, item) => {
				obj[item.field] = item.message;
				return obj;
			}, {});
		}

		return new GraphQLError(errorData);
	};
}
