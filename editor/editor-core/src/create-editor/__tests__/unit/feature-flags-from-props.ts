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

  describe('singleLayout', () => {
    it('should default singleLayout to false if allowLayouts has boolean value', () => {
      let flags = createFeatureFlagsFromProps({
        allowLayouts: true,
      });
      expect(flags.singleLayout).toBe(false);

      flags = createFeatureFlagsFromProps({
        allowLayouts: false,
      });
      expect(flags.singleLayout).toBe(false);
    });

    it('should set singleLayout to false if UNSAFE_allowSingleColumnLayout is false', () => {
      const flags = createFeatureFlagsFromProps({
        allowLayouts: {
          UNSAFE_allowSingleColumnLayout: false,
        },
      });
      expect(flags.singleLayout).toBe(false);
    });
    it('should default singleLayout to true if UNSAFE_allowSingleColumnLayout is true', () => {
      const flags = createFeatureFlagsFromProps({
        allowLayouts: {
          UNSAFE_allowSingleColumnLayout: true,
        },
      });
      expect(flags.singleLayout).toBe(true);
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

    describe.each(['tableRenderOptimization'])('%s', (flagName) => {
      it.each<{ actual?: any; expected?: any }>([
        { actual: true, expected: true },
        { actual: false, expected: false },
        // if not set, tableRenderOptimization will default to true
        { actual: undefined, expected: true },
        { actual: null, expected: true },
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
            findReplace: true,
            findReplaceMatchCase: true,
            extensionLocalIdGeneration: true,
            addColumnWithCustomStep: true,
            undoRedoButtons: true,
            catchAllTracking: true,
            showAvatarGroupAsPlugin: false,
            twoLineEditorToolbar: false,
            // already using .featureFlags explicitly
            // stickyHeadersOptimization: true,
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

  describe('tableCellOptionsInFloatingToolbar', () => {
    it('should default tableCellOptionsInFloatingToolbar to false if no FF is passed', () => {
      const flags = createFeatureFlagsFromProps({});
      expect(flags.tableCellOptionsInFloatingToolbar).toBe(false);
    });

    it('should default tableCellOptionsInFloatingToolbar to true if FF is passed to true', () => {
      const flags = createFeatureFlagsFromProps({
        featureFlags: {
          'table-cell-options-in-floating-toolbar': true,
        },
      });
      expect(flags.tableCellOptionsInFloatingToolbar).toBe(true);
    });

    it('should default tableCellOptionsInFloatingToolbar to false if FF is passed to false', () => {
      const flags = createFeatureFlagsFromProps({
        featureFlags: {
          'table-cell-options-in-floating-toolbar': false,
        },
      });
      expect(flags.tableCellOptionsInFloatingToolbar).toBe(false);
    });
  });

  describe('hover previews', () => {
    it('should add the FF value', () => {
      expect(
        createFeatureFlagsFromProps({
          featureFlags: {
            showHoverPreview: true,
          },
        }),
      ).toEqual(
        expect.objectContaining({
          showHoverPreview: true,
        }),
      );
    });

    it('should default to false if nothing passed in', () => {
      expect(
        createFeatureFlagsFromProps({
          featureFlags: {},
        }),
      ).toEqual(
        expect.objectContaining({
          showHoverPreview: false,
        }),
      );
    });
  });

  describe('floating toolbar copy button', () => {
    it('should add the FF value', () => {
      expect(
        createFeatureFlagsFromProps({
          featureFlags: {
            floatingToolbarCopyButton: true,
          },
        }),
      ).toEqual(
        expect.objectContaining({
          floatingToolbarCopyButton: true,
        }),
      );
    });

    it('should default to false if nothing passed in', () => {
      expect(
        createFeatureFlagsFromProps({
          featureFlags: {},
        }),
      ).toEqual(
        expect.objectContaining({
          floatingToolbarCopyButton: false,
        }),
      );
    });
  });

  describe('indentationButtonsInTheToolbar', () => {
    it('should add the FF value', () => {
      expect(
        createFeatureFlagsFromProps({
          featureFlags: {
            'indentation-buttons-in-the-toolbar': true,
          },
        }),
      ).toEqual(
        expect.objectContaining({
          indentationButtonsInTheToolbar: true,
        }),
      );
    });

    it('should default to false if nothing passed in', () => {
      expect(
        createFeatureFlagsFromProps({
          featureFlags: {},
        }),
      ).toEqual(
        expect.objectContaining({
          indentationButtonsInTheToolbar: false,
        }),
      );
    });
  });

  describe('useSomewhatSemanticTextColorNames', () => {
    it('should add the FF value', () => {
      expect(
        createFeatureFlagsFromProps({
          featureFlags: {
            'use-somewhat-semantic-text-color-names': true,
          },
        }),
      ).toEqual(
        expect.objectContaining({
          useSomewhatSemanticTextColorNames: true,
        }),
      );
    });

    it('should default to false if nothing passed in', () => {
      expect(
        createFeatureFlagsFromProps({
          featureFlags: {},
        }),
      ).toEqual(
        expect.objectContaining({
          useSomewhatSemanticTextColorNames: false,
        }),
      );
    });
  });

  describe('floating toolbar link settings button', () => {
    it('should add the FF value', () => {
      expect(
        createFeatureFlagsFromProps({
          featureFlags: {
            'floating-toolbar-link-settings-button': 'true',
          },
        }),
      ).toEqual(
        expect.objectContaining({
          floatingToolbarLinkSettingsButton: 'true',
        }),
      );
    });

    it('should default to undefined if nothing passed in', () => {
      expect(
        createFeatureFlagsFromProps({
          featureFlags: {},
        }),
      ).toEqual(
        expect.objectContaining({
          floatingToolbarLinkSettingsButton: undefined,
        }),
      );
    });
  });

  describe('restartNumberedLists', () => {
    it('should add the FF value', () => {
      expect(
        createFeatureFlagsFromProps({
          featureFlags: {
            restartNumberedLists: true,
          },
        }),
      ).toEqual(
        expect.objectContaining({
          restartNumberedLists: true,
        }),
      );
    });

    it('should default to false if nothing passed in', () => {
      expect(
        createFeatureFlagsFromProps({
          featureFlags: {},
        }),
      ).toEqual(
        expect.objectContaining({
          restartNumberedLists: false,
        }),
      );
    });
  });

  describe('listNumberContinuity', () => {
    it('should add the FF value', () => {
      expect(
        createFeatureFlagsFromProps({
          featureFlags: {
            listNumberContinuity: true,
          },
        }),
      ).toEqual(
        expect.objectContaining({
          listNumberContinuity: true,
        }),
      );
    });

    it('should default to false if nothing passed in', () => {
      expect(
        createFeatureFlagsFromProps({
          featureFlags: {},
        }),
      ).toEqual(
        expect.objectContaining({
          listNumberContinuity: false,
        }),
      );
    });
  });

  describe('restartNumberedListsToolbar', () => {
    it('should add the FF value', () => {
      expect(
        createFeatureFlagsFromProps({
          featureFlags: {
            restartNumberedListsToolbar: true,
          },
        }),
      ).toEqual(
        expect.objectContaining({
          restartNumberedListsToolbar: true,
        }),
      );
    });

    it('should default to false if nothing passed in', () => {
      expect(
        createFeatureFlagsFromProps({
          featureFlags: {},
        }),
      ).toEqual(
        expect.objectContaining({
          restartNumberedListsToolbar: false,
        }),
      );
    });
  });

  describe('lpLinkPickerFocusTrap', () => {
    it('should add the FF value', () => {
      expect(
        createFeatureFlagsFromProps({
          featureFlags: {
            'lp-link-picker-focus-trap': true,
          },
        }),
      ).toEqual(
        expect.objectContaining({
          lpLinkPickerFocusTrap: true,
        }),
      );
    });

    it('should default to false if nothing passed in', () => {
      expect(
        createFeatureFlagsFromProps({
          featureFlags: {},
        }),
      ).toEqual(
        expect.objectContaining({
          lpLinkPickerFocusTrap: false,
        }),
      );
    });
  });

  describe('prevent popup overflow', () => {
    it('should add the FF value', () => {
      expect(
        createFeatureFlagsFromProps({
          featureFlags: {
            ['prevent-popup-overflow']: true,
          },
        }),
      ).toEqual(
        expect.objectContaining({
          preventPopupOverflow: true,
        }),
      );
    });

    it('should default to false if nothing passed in', () => {
      expect(
        createFeatureFlagsFromProps({
          featureFlags: {},
        }),
      ).toEqual(
        expect.objectContaining({
          preventPopupOverflow: false,
        }),
      );
    });
  });

  describe('expanded chart colors', () => {
    it('should add the FF value', () => {
      expect(
        createFeatureFlagsFromProps({
          featureFlags: {
            'expanded-chart-colors': true,
          },
        }),
      ).toEqual(
        expect.objectContaining({
          expandedChartColors: true,
        }),
      );
    });

    it('should not exist in featureFlags if not set in props', () => {
      const featureFlags = createFeatureFlagsFromProps({
        featureFlags: {},
      });
      expect(featureFlags.expandedChartColors).toBeUndefined();
    });

    it('should not exist in feaureFlags if not set to boolean value', () => {
      const featureFlags = createFeatureFlagsFromProps({
        featureFlags: { 'expanded-chart-colors': 'somethingInvalid' },
      });
      expect(featureFlags.expandedChartColors).toBeUndefined();
    });
  });
});
