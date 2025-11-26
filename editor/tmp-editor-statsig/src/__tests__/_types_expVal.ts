/**
 * Type tests for expVal and expValNoExposure
 *
 * This file tests that the type guards work correctly at compile time.
 * These tests will fail at build/typecheck time if types are incorrect.
 *
 * Note: This file is not meant to be executed, only type-checked.
 */

import { expVal, expValNoExposure } from '../expVal';

// ============================================================================
// Boolean Experiment Tests
// ============================================================================

// ✅ SHOULD WORK: Passing 'false' as default value
expVal('example-boolean', 'isEnabled', false);
expValNoExposure('example-boolean', 'isEnabled', false);

// ❌ SHOULD FAIL: Passing 'true' as default value (blocked by type guard)
// @ts-expect-error - true is not allowed as default value for expVal
expVal('example-boolean', 'isEnabled', true);

// @ts-expect-error - true is not allowed as default value for expValNoExposure
expValNoExposure('example-boolean', 'isEnabled', true);

// ============================================================================
// Multivariate Experiment Tests - String values
// ============================================================================

// ✅ SHOULD WORK: String default values
expVal('example-multivariate', 'variant', 'one');
expVal('example-multivariate', 'variant', 'two');
expVal('example-multivariate', 'variant', 'three');

expValNoExposure('example-multivariate', 'variant', 'one');
expValNoExposure('example-multivariate', 'variant', 'two');
expValNoExposure('example-multivariate', 'variant', 'three');

// ============================================================================
// Non-existent Experiment Tests
// ============================================================================

// ❌ SHOULD FAIL: Non-existent experiment name
// @ts-expect-error - 'non-existent-experiment' does not exist
expVal('non-existent-experiment', 'isEnabled', false);

// @ts-expect-error - 'fake-experiment' does not exist
expValNoExposure('fake-experiment', 'param', 'value');

// ============================================================================
// Type Inference Tests
// ============================================================================

// ✅ SHOULD WORK: Correct returned types
expVal('example-boolean', 'isEnabled', false) satisfies boolean;
expValNoExposure('example-boolean', 'isEnabled', false) satisfies boolean;

expVal('example-multivariate', 'variant', 'one') satisfies string;
