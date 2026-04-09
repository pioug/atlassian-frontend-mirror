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
	*readStreamSuccess(): Generator<{
        type: string;
        message: {
            content: string;
        };
    }, void, unknown> {
		yield successMock;
	},
	*readStreamError(): Generator<{
        type: string;
        message: {
            message_template: string;
            content: string;
            status_code: number;
            error: string;
        };
    }, void, unknown> {
		yield errorMock;
	},
	*readStreamErrorMulti(): Generator<{
        type: string;
        message: {
            content: string;
        };
    }, void, unknown> {
		yield successMock;
		yield errorMock;
	},
};
