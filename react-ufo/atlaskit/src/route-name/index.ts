import { withProfiling } from '../self-measurements';

const getUFORouteName = withProfiling(function getUFORouteName(route: {
	ufoName?: string;
	name: string;
}): string {
	if (route.ufoName != null) {
		return route.ufoName;
	}
	return route.name;
});

export default getUFORouteName;
