import { type MockRequest } from 'xhr-mock';
import { type RequestData } from '.';
import { matches } from '@atlaskit/media-common';

export const matchMethod = (req: MockRequest, data: RequestData): boolean => {
	return data.method ? data.method === req.method() : true;
};

export const exactMatchUrl = (req: MockRequest, data: RequestData): boolean => {
	return data.url ? matches(data.url)(req.url()) : true;
};

export const exactMatchHeaders = (req: MockRequest, data: RequestData): boolean => {
	return data.headers ? matches(data.headers)(req.headers()) : true;
};

export const exactMatchBody = (req: MockRequest, data: RequestData): boolean => {
	try {
		return data.body ? matches(JSON.parse(data.body))(JSON.parse(req.body() || '{}')) : true;
	} catch (e) {
		return false;
	}
};

export const exactMatch = (req: MockRequest, data: RequestData): boolean => {
	return [matchMethod, exactMatchUrl, exactMatchHeaders, exactMatchBody].reduce(
		(coll, fn) => coll && fn(req, data),
		true,
	);
};
