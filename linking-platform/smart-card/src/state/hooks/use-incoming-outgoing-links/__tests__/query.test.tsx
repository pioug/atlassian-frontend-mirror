import { queryIncomingOutgoingLinks } from '../query';

it('query contains the expected GraphQL structure', () => {
	expect(queryIncomingOutgoingLinks).toContain('query SmartCard_ContentReferencedEntity_V1');
	expect(queryIncomingOutgoingLinks).toContain('incoming: contentReferencedEntityInverse');
	expect(queryIncomingOutgoingLinks).toContain('outgoing: contentReferencedEntity');
});
