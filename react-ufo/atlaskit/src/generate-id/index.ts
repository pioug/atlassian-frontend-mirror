import { withProfiling } from '../self-measurements';

let id = 0;

/** Get a new string id each time it's called */
const generateId = withProfiling(function generateId() {
	return String(id++);
});

export default generateId;
