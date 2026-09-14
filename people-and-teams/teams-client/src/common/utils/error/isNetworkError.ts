export function isNetworkError(error: Error): boolean {
	return (
		error &&
		!!error.message &&
		// Firefox
		(error.message.includes('NetworkError') ||
			// Chrome
			error.message.startsWith('Failed to fetch') ||
			error.message.includes('GraphQL error: Failed to fetch') ||
			// cancel by users or unknown reason
			error.message.includes('GraphQL error: The operation was aborted') ||
			error.message.includes('GraphQL error: cancelled') ||
			error.message.includes('Abgebrochen') ||
			error.message.includes('отменено') ||
			error.message.includes('Сетевое соединение потеряно.') ||
			error.message.includes('anulowane') ||
			error.message.includes('annulé') ||
			error.message.includes('已取消') ||
			error.message.includes('cancelado') ||
			error.message.includes('キャンセルしました') ||
			error.message.includes('cancelled') ||
			error.message.includes('Network error') ||
			// GraphQL-wrapping network error
			!!((error as any)['graphQLErrors'] && (error as any)['networkError']))
	);
}
