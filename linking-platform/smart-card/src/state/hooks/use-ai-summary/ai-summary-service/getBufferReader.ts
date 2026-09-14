export const getBufferReader = (response: Response): ReadableStreamDefaultReader<string> => {
	if (!response.body) {
		throw new Error('Response body is empty');
	}
	return response.body.pipeThrough(new TextDecoderStream()).getReader();
};
