type RouteNameContextType = {
	current: string | null;
};

// The UFORouteName object is a global singleton
const UFORouteName: RouteNameContextType = { current: null };

export default UFORouteName;
