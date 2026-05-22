import {
	type BaseEntity,
	isBaseEntity,
	isConversationEntity,
	isDesignEntity,
	isDocumentEntity,
	isEntityType,
	isMessageEntity,
	isProjectEntity,
	isRemoteLinkEntity,
	isUnsupportedEntity,
	isWorkItemEntity,
} from '../entry-points/entity-types';

const baseEntity: BaseEntity = {
	displayName: 'Entity',
	id: 'entity-1',
	url: 'https://atlassian.com/entity-1',
};

describe('entity type guards', () => {
	describe('isBaseEntity', () => {
		it('returns true for base entity shape', () => {
			expect(isBaseEntity(baseEntity)).toBe(true);
		});

		it('returns false for invalid base entity shape', () => {
			expect(isBaseEntity({ displayName: 'missing-fields' })).toBe(false);
		});
	});

	describe('isDesignEntity', () => {
		it('returns true for design entity', () => {
			const entity = { ...baseEntity, status: 'READY_FOR_DEVELOPMENT', type: 'FILE' };
			expect(isDesignEntity(entity)).toBe(true);
		});

		it('returns false for non design entity', () => {
			expect(isDesignEntity(baseEntity)).toBe(false);
		});

		it('returns false for invalid design status and type values', () => {
			const entity = { ...baseEntity, status: 'NOT_A_STATUS', type: 'NOT_A_TYPE' };
			expect(isDesignEntity(entity)).toBe(false);
		});
	});

	describe('isRemoteLinkEntity', () => {
		it('returns true for remote link entity', () => {
			const entity = {
				...baseEntity,
				'atlassian:remote-link': { type: 'document' },
			};
			expect(isRemoteLinkEntity(entity)).toBe(true);
		});

		it('returns false for non remote link entity', () => {
			expect(isRemoteLinkEntity(baseEntity)).toBe(false);
		});

		it('returns false for invalid remote link type value', () => {
			const entity = {
				...baseEntity,
				'atlassian:remote-link': { type: 'NOT_A_REMOTE_TYPE' },
			};
			expect(isRemoteLinkEntity(entity)).toBe(false);
		});
	});

	describe('isProjectEntity', () => {
		it('returns true for project entity', () => {
			const entity = {
				...baseEntity,
				'atlassian:project': {},
			};
			expect(isProjectEntity(entity)).toBe(true);
		});

		it('returns false for non project entity', () => {
			expect(isProjectEntity(baseEntity)).toBe(false);
		});
	});

	describe('isWorkItemEntity', () => {
		it('returns true for work item entity', () => {
			const entity = {
				...baseEntity,
				'atlassian:work-item': { status: 'Done', subtype: 'task', team: 'Linking' },
			};
			expect(isWorkItemEntity(entity)).toBe(true);
		});

		it('returns false for non work item entity', () => {
			expect(isWorkItemEntity(baseEntity)).toBe(false);
		});

		it('returns false for invalid work item subtype', () => {
			const entity = {
				...baseEntity,
				'atlassian:work-item': { status: 'Done', subtype: 'NOT_A_SUBTYPE', team: 'Linking' },
			};
			expect(isWorkItemEntity(entity)).toBe(false);
		});
	});

	describe('isDocumentEntity', () => {
		it('returns true for document entity', () => {
			const entity = {
				...baseEntity,
				type: { category: 'document', iconUrl: 'https://atlassian.com/icon.png' },
			};
			expect(isDocumentEntity(entity)).toBe(true);
		});

		it('returns false for non document entity', () => {
			expect(isDocumentEntity(baseEntity)).toBe(false);
		});

		it('returns false for invalid document category', () => {
			const entity = {
				...baseEntity,
				type: { category: 'NOT_A_CATEGORY' },
			};
			expect(isDocumentEntity(entity)).toBe(false);
		});
	});

	describe('isMessageEntity', () => {
		it('returns true for message entity', () => {
			const entity = {
				...baseEntity,
				isPinned: true,
			};
			expect(isMessageEntity(entity)).toBe(true);
		});

		it('returns false for non message entity', () => {
			expect(isMessageEntity(baseEntity)).toBe(false);
		});
	});

	describe('isConversationEntity', () => {
		it('returns true for conversation entity', () => {
			const entity = {
				...baseEntity,
				memberCount: 2,
			};
			expect(isConversationEntity(entity)).toBe(true);
		});

		it('returns false for non conversation entity', () => {
			expect(isConversationEntity(baseEntity)).toBe(false);
		});
	});

	describe('isUnsupportedEntity', () => {
		it('returns true for unsupported entity', () => {
			const entity = {
				...baseEntity,
				customPayload: { foo: 'bar' },
			};
			expect(isUnsupportedEntity(entity)).toBe(true);
		});

		it('returns false for known entity type', () => {
			const entity = { ...baseEntity, status: 'READY_FOR_DEVELOPMENT', type: 'FILE' };
			expect(isUnsupportedEntity(entity)).toBe(false);
		});
	});

	describe('isEntityType', () => {
		it('returns true for any supported entity type', () => {
			expect(isEntityType(baseEntity)).toBe(true);
			expect(
				isEntityType({
					...baseEntity,
					'atlassian:work-item': { status: 'Done', subtype: 'task', team: 'Linking' },
				}),
			).toBe(true);
		});

		it('returns false for invalid value', () => {
			expect(isEntityType({ displayName: 'only-displayName' })).toBe(false);
			expect(isEntityType(undefined)).toBe(false);
			expect(isEntityType(null)).toBe(false);
		});
	});
});
