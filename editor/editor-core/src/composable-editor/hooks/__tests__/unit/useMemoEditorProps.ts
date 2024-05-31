import { renderHook } from '@testing-library/react-hooks';

import { EditorPresetBuilder } from '@atlaskit/editor-common/preset';

import type { EditorNextProps, EditorProps } from '../../../../types/editor-props';
import { useMemoEditorProps } from '../../useMemoEditorProps';

describe('useMemoEditorProps', () => {
	const preset = new EditorPresetBuilder();
	const propOne: EditorProps & EditorNextProps = {
		appearance: 'full-page',
		preset,
	};
	const propTwo: EditorProps & EditorNextProps = {
		appearance: 'full-page',
		preset,
	};

	it('should return the same object referency when prop values did not changed', () => {
		const { result, rerender } = renderHook(({ props }) => useMemoEditorProps(props), {
			initialProps: { props: propOne },
		});
		const resultOne = result.current;

		rerender({ props: { ...propTwo } });

		const resultTwo = result.current;

		expect(resultOne).toBe(resultTwo);
	});
});
