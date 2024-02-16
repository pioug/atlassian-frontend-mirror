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

  describe('placeholder text', () => {
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
            findReplace: true,
            findReplaceMatchCase: true,
            extensionLocalIdGeneration: true,
            addColumnWithCustomStep: true,
            undoRedoButtons: true,
            catchAllTracking: true,
            showAvatarGroupAsPlugin: false,
            twoLineEditorToolbar: false,
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
