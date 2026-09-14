export const decodeJwtToken = (token: string): { clientId?: string } => {
	return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
};
