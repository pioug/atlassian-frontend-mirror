import { queryIncomingOutgoingLinks } from '../query';

it('query snapshot', () => {
	expect(queryIncomingOutgoingLinks).toMatchSnapshot();
});
