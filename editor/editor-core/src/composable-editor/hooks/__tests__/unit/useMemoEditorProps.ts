import { renderHook } from '@testing-library/react';

import { EditorPresetBuilder } from '@atlaskit/editor-common/preset';

import type { EditorNextProps, EditorProps } from '../../../../types/editor-props';
import type { WithAppearanceComponent } from '../../../../types/with-appearance-component';
import { useMemoEditorProps } from '../../useMemoEditorProps';

describe('useMemoEditorProps', () => {
	const preset = new EditorPresetBuilder();
	const AppearanceComponent = () => null;
	const propOne: EditorProps & EditorNextProps & WithAppearanceComponent = {
		appearance: 'full-page',
		preset,
		AppearanceComponent,
	};
	const propTwo: EditorProps & EditorNextProps & WithAppearanceComponent = {
		appearance: 'full-page',
		preset,
		AppearanceComponent,
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
