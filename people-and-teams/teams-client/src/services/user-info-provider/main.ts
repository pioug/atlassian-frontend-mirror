import { DEFAULT_CONFIG } from '../constants';

// Needs to be declared here to avoid blowing up this earlyInit bundle
class FetchError extends Error {
	name: string;
	response: Response;
	constructor(response: Response) {
		super(`Request failed with status ${response.status}`);
		this.response = response;
		this.name = this.constructor.name;
	}
}

interface UserInfo {
	userId: string;
	locale: string;
	fullName: string;
	avatarUrl: string;
	email: string;
	title: string;
}

// export for testing
export class UserInfoProvider {
	private promise?: Promise<UserInfo>;

	get(fetchOp: typeof fetch = fetch): Promise<UserInfo> {
		if (this.promise) {
			return this.promise;
		}

		const getJson = (url: string) =>
			fetchOp(url, {
				method: 'GET',
				mode: 'cors',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
			}).then((response) => {
				if (!response.ok) {
					throw new FetchError(response);
				}
				return response.json();
			});

		this.promise = getJson(`${DEFAULT_CONFIG.stargateRoot}/me`).then((me) => {
			return {
				userId: me.account_id,
				locale: me.locale,
				fullName: me.name,
				avatarUrl: me.picture,
				email: me.email,
				title: me.extended_profile?.job_title,
			};
		});

		return this.promise;
	}
}

export const userInfoProvider = new UserInfoProvider();
