type Primitive = number | string | boolean | bigint | symbol | null | undefined;

export const captureException = async (
	_error: Error,
	_packageName: string,
	_tags?: { [key: string]: Primitive },
) => {
	// Re-introduce in EDM-9682
	return;
};
