import type { Member } from './Member';

export /**
 * @deprecated migrate to generated types
 */
interface AddMembershipReponse {
	members: Member[];
	errors: {
		accountId: string;
		code: string;
		message: string;
	}[];
}
