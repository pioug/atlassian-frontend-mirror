const UUID_REGEXP_TEAMS_GROUPS =
	/^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;
const UUID_REGEXP_OLD_AAID =
	/^[a-fA-F0-9]{1,8}:[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;
const UUID_REGEXP_NEW_AAID = /^[a-fA-F0-9]{24,24}$/;

export const checkValidId: any = (id: string) => {
	return (
		UUID_REGEXP_NEW_AAID.test(id) ||
		UUID_REGEXP_OLD_AAID.test(id) ||
		UUID_REGEXP_TEAMS_GROUPS.test(id)
	);
};
