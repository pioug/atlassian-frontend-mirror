export type ReadMediaTokenResponse = {
	token?: string;
	headerImageId: string; //Same as what was passed in
	baseUrl: string; // media's url
	clientId: string; // media's client id
};
