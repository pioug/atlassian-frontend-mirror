const successMock = {
	type: 'ANSWER_PART',
	message: { content: 'something' },
};

const errorMock = {
	type: 'ERROR',
	message: {
		message_template: 'NETWORK_ERROR',
		content: 'Error answering prompt',
		status_code: 500,
		error: 'The server has encountered trouble with some components',
	},
};

export const aiSummaryMocks = {
	*readStreamSuccess() {
		yield successMock;
	},
	*readStreamError() {
		yield errorMock;
	},
	*readStreamErrorMulti() {
		yield successMock;
		yield errorMock;
	},
};
