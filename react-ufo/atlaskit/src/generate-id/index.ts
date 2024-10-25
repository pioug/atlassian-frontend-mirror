let id = 0;

/** Get a new string id each time it's called */
export default function generateId() {
	return String(id++);
}
