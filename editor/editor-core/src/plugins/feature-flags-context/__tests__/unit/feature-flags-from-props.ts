import { createFeatureFlagsFromProps } from '../../feature-flags-from-props';

describe('Feature Flags from Props', () => {
  describe('errorBoundaryDocStructure', () => {
    it('should default errorBoundaryDocStructure to false if no FF is passed', () => {
      const flags = createFeatureFlagsFromProps({});
      expect(flags.errorBoundaryDocStructure).toBe(false);
    });

    it('should default errorBoundaryDocStructure to true if FF is passed to true', () => {
      const flags = createFeatureFlagsFromProps({
        featureFlags: {
          useErrorBoundaryDocStructure: true,
        },
      });
      expect(flags.errorBoundaryDocStructure).toBe(true);
    });

    it('should default errorBoundaryDocStructure to false if FF is passed to false', () => {
      const flags = createFeatureFlagsFromProps({
        featureFlags: {
          useErrorBoundaryDocStructure: false,
        },
      });
      expect(flags.errorBoundaryDocStructure).toBe(false);
    });
  });
  describe('interactiveExpand', () => {
    it('should default interactiveExpand to true if allowExpand is true', () => {
      const flags = createFeatureFlagsFromProps({ allowExpand: true });
      expect(flags.interactiveExpand).toBe(true);
    });

    it('should default interactiveExpand to true if allowExpand is an empty object', () => {
      const flags = createFeatureFlagsFromProps({ allowExpand: {} });
      expect(flags.interactiveExpand).toBe(true);
    });

    it('should default interactiveExpand to false if allowExpand is false', () => {
      const flags = createFeatureFlagsFromProps({ allowExpand: false });
      expect(flags.interactiveExpand).toBe(false);
    });

    it('should default interactiveExpand to false if allowExpand.allowInteractiveExpand is false', () => {
      const flags = createFeatureFlagsFromProps({
        allowExpand: { allowInteractiveExpand: false },
      });
      expect(flags.interactiveExpand).toBe(false);
    });
  });

  describe('newInsertionBehaviour', () => {
    it('should reflect allowNewInsertionBehaviour prop as newInsertionBehaviour', () => {
      const flags = createFeatureFlagsFromProps({
        allowNewInsertionBehaviour: true,
      });
      expect(flags.newInsertionBehaviour).toBe(true);
    });
  });

  describe('moreTextColors', () => {
    it('should default moreTextColors to false if allowTextColour is true', () => {
      const flags = createFeatureFlagsFromProps({
        allowTextColor: true,
      });
      expect(flags.moreTextColors).toBe(false);
    });
    it('should default moreTextColors to false if allowTextColour is an empty object', () => {
      const flags = createFeatureFlagsFromProps({
        allowTextColor: {},
      });
      expect(flags.moreTextColors).toBe(false);
    });
    it('should set moreTextColors to false if allowTextColour.allowMoreTextColors is false', () => {
      const flags = createFeatureFlagsFromProps({
        allowTextColor: {
          allowMoreTextColors: false,
        },
      });
      expect(flags.moreTextColors).toBe(false);
    });
    it('should set moreTextColors to true if allowTextColour.allowMoreTextColors is true', () => {
      const flags = createFeatureFlagsFromProps({
        allowTextColor: {
          allowMoreTextColors: true,
        },
      });
      expect(flags.moreTextColors).toBe(true);
    });
  });

  describe('placeholder text', () => {
    it('should default placeholderHints to false if a an empty placeholderHints string array is provided', () => {
      const flags = createFeatureFlagsFromProps({
        placeholderHints: [],
      });
      expect(flags.placeholderHints).toBe(false);
    });
    it('should default placeholderHints to false if a no placeholderHints string array is provided', () => {
      const flags = createFeatureFlagsFromProps({
        placeholderHints: undefined,
      });
      expect(flags.placeholderHints).toBe(false);
    });
    it('should set placeholderHints to true if a placeholderHints string array is provided', () => {
      const flags = createFeatureFlagsFromProps({
        placeholderHints: ['foo', 'bar', 'baz'],
      });
      expect(flags.placeholderHints).toBe(true);
    });

    it('should default placeholderBracketHint to false if a no placeholderBracketHint string is provided', () => {
      const flags = createFeatureFlagsFromProps({
        placeholderBracketHint: undefined,
      });
      expect(flags.placeholderBracketHint).toBe(false);
    });
    it('should set placeholderBracketHint to true if a placeholderBracketHint string is provided', () => {
      const flags = createFeatureFlagsFromProps({
        placeholderBracketHint: 'hello world',
      });
      expect(flags.placeholderBracketHint).toBe(true);
    });
  });

  describe('find/replace', () => {
    it('should set findReplace to true if allowFindReplace prop is true', () => {
      const flags = createFeatureFlagsFromProps({
        allowFindReplace: true,
      });
      expect(flags.findReplace).toBe(true);
    });
    it('should set findReplace to false if allowFindReplace prop is false', () => {
      const flags = createFeatureFlagsFromProps({
        allowFindReplace: false,
      });
      expect(flags.findReplace).toBe(false);
    });
    describe('findReplaceMatchCase', () => {
      it('should set findReplaceMatchCase to false if allowFindReplace props is false', () => {
        const flags = createFeatureFlagsFromProps({
          allowFindReplace: false,
        });
        expect(flags.findReplaceMatchCase).toBe(false);
      });
      it('should set findReplaceMatchCase to false if allowFindReplace props is boolean true', () => {
        const flags = createFeatureFlagsFromProps({
          allowFindReplace: true,
        });
        expect(flags.findReplaceMatchCase).toBe(false);
      });
      it('should set findReplaceMatchCase to false if allowFindReplace props is object but missing allowMatchCase property', () => {
        const flags = createFeatureFlagsFromProps({
          allowFindReplace: {},
        });
        expect(flags.findReplaceMatchCase).toBe(false);
      });

      it('should set findReplaceMatchCase to false if allowFindReplace props is object but allowMatchCase is false', () => {
        const flags = createFeatureFlagsFromProps({
          allowFindReplace: {
            allowMatchCase: false,
          },
        });
        expect(flags.findReplaceMatchCase).toBe(false);
      });
      it('should set findReplaceMatchCase to true if allowFindReplace props is object and allowMatchCase is true', () => {
        const flags = createFeatureFlagsFromProps({
          allowFindReplace: {
            allowMatchCase: true,
          },
        });
        expect(flags.findReplaceMatchCase).toBe(true);
      });
    });
  });

  describe('table optimization flags', () => {
    describe.each([
      'stickyHeadersOptimization',
      'initialRenderOptimization',
      'mouseMoveOptimization',
      'tableRenderOptimization',
      'tableOverflowShadowsOptimization',
    ])('%s', (flagName) => {
      it.each<{ actual?: any; expected?: any }>([
        { actual: true, expected: true },
        { actual: false, expected: false },
        { actual: undefined, expected: false },
        { actual: null, expected: false },
      ])(`set ${flagName} to %s based on feature flag`, (testData) => {
        const { actual, expected } = testData;
        const flags = createFeatureFlagsFromProps({
          featureFlags: {
            [flagName]: actual,
          },
        });
        expect((flags as any)[flagName]).toBe(expected);
      });
    });
  });

  describe('featureFlags', () => {
    it('should merge mapFeatureFlagsProp result', () => {
      expect(
        createFeatureFlagsFromProps({
          featureFlags: {
            a: true,
            b: false,
          },
        }),
      ).toEqual(
        expect.objectContaining({
          a: true,
          b: false,
        }),
      );
    });

    it('should retain existing mappings', () => {
      expect(
        createFeatureFlagsFromProps({
          featureFlags: {
            newInsertionBehaviour: true,
            interactiveExpand: true,
            placeholderBracketHint: true,
            placeholderHints: true,
            moreTextColors: true,
            findReplace: true,
            findReplaceMatchCase: true,
            extensionLocalIdGeneration: true,
            keyboardAccessibleDatepicker: true,
            addColumnWithCustomStep: true,
            undoRedoButtons: true,
            catchAllTracking: true,
            showAvatarGroupAsPlugin: false,
            // already using .featureFlags explicitly
            // stickyHeadersOptimization: true,
            // nextEmojiNodeView: true,
            // initialRenderOptimization: true,
            // mouseMoveOptimization: true,
            // tableRenderOptimization: true,
          },
        }),
      ).toEqual(createFeatureFlagsFromProps({}));
    });
  });

  describe('synchronyErrorDocStructure', () => {
    it('should add the FF value', () => {
      expect(
        createFeatureFlagsFromProps({
          featureFlags: {
            synchronyErrorDocStructure: true,
          },
        }),
      ).toEqual(
        expect.objectContaining({
          synchronyErrorDocStructure: true,
        }),
      );
    });
  });
});
