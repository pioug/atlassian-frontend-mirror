export interface IdentityProfileData {
	account_id: string;
	name: string;
	nickname: string;
	locale: string;
	picture: string;
	email: string;
	zoneinfo: string;

	extended_profile: {
		job_title: string;
		organization: string;
		department: string;
		location: string;
		phone_number: string;
		about_me: string;
		pronouns: string;
	};
}
