// fetch throws TypeError for network errors
export function isFetchNetworkError(err: any): err is TypeError {
	return err instanceof TypeError;
}
