let id = 0;

/** Get a new string id each time it's called */
function generateId(): string {
	return String(id++);
}

export default generateId;
