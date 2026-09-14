import { inferValueKind } from '../infer-value-kind';

describe('inferValueKind', () => {
	it('classifies PascalCase as component', () => {
		expect(inferValueKind('AvatarItem')).toBe('component');
	});

	it('classifies SCREAMING_SNAKE as value', () => {
		expect(inferValueKind('BORDER_WIDTH')).toBe('value');
	});

	it('classifies camelCase as value', () => {
		expect(inferValueKind('useAvatarContext')).toBe('value');
	});
});
