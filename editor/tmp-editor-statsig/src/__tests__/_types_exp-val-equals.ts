/**
 * Type tests for expValEquals and expValEqualsNoExposure
 *
 * This file tests that the type guards work correctly at compile time.
 * These tests will fail at build/typecheck time if types are incorrect.
 *
 * Note: This file is not meant to be executed, only type-checked.
 */

import { expValEquals } from '../exp-val-equals';
import { expValEqualsNoExposure } from '../exp-val-equals-no-exposure';

// ============================================================================
// Boolean Experiment Tests
// ============================================================================

// ✅ SHOULD WORK: Passing 'true' as expected value
expValEquals('example-boolean', 'isEnabled', true);
expValEqualsNoExposure('example-boolean', 'isEnabled', true);

// ✅ SHOULD WORK: Passing 'true' as expected value with 'false' as default
expValEquals('example-boolean', 'isEnabled', true, false);
expValEqualsNoExposure('example-boolean', 'isEnabled', true, false);

// ✅ SHOULD WORK: Passing 'true' as expected value with null as default
expValEquals('example-boolean', 'isEnabled', true, null);
expValEqualsNoExposure('example-boolean', 'isEnabled', true, null);

// ❌ SHOULD FAIL: Passing 'false' as expected value (blocked by type guard)
// @ts-expect-error - false is not allowed as an expected value
expValEquals('example-boolean', 'isEnabled', false);

// @ts-expect-error - false is not allowed as an expected value
expValEqualsNoExposure('example-boolean', 'isEnabled', false);

// ❌ SHOULD FAIL: Passing 'false' as expected value even with default
// @ts-expect-error - false is not allowed as an expected value
expValEquals('example-boolean', 'isEnabled', false, false);

// @ts-expect-error - false is not allowed as an expected value
expValEqualsNoExposure('example-boolean', 'isEnabled', false, null);

// ❌ SHOULD FAIL: Passing 'true' as default value (blocked by type guard)
// @ts-expect-error - true is not allowed as a default value
expValEquals('example-boolean', 'isEnabled', true, true);

// @ts-expect-error - true is not allowed as a default value
expValEqualsNoExposure('example-boolean', 'isEnabled', true, true);

// ============================================================================
// Multivariate Experiment Tests
// ============================================================================

// ✅ SHOULD WORK: Valid values from the 'values' array
expValEquals('example-multivariate', 'variant', 'one');
expValEquals('example-multivariate', 'variant', 'two');
expValEquals('example-multivariate', 'variant', 'three');

expValEqualsNoExposure('example-multivariate', 'variant', 'one');
expValEqualsNoExposure('example-multivariate', 'variant', 'two');
expValEqualsNoExposure('example-multivariate', 'variant', 'three');

// ✅ SHOULD WORK: Valid expected and default values
expValEquals('example-multivariate', 'variant', 'one', 'two');
expValEqualsNoExposure('example-multivariate', 'variant', 'three', 'one');

// ✅ SHOULD WORK: Valid expected value with null default
expValEquals('example-multivariate', 'variant', 'one', null);
expValEqualsNoExposure('example-multivariate', 'variant', 'two', null);

// ❌ SHOULD FAIL: Invalid string not in 'values' array
// @ts-expect-error - 'invalid' is not in the values array
expValEquals('example-multivariate', 'variant', 'invalid');

// @ts-expect-error - 'four' is not in the values array
expValEqualsNoExposure('example-multivariate', 'variant', 'four');

// ❌ SHOULD FAIL: Invalid default value
// @ts-expect-error - 'invalid' is not in the values array
expValEquals('example-multivariate', 'variant', 'one', 'invalid');

// @ts-expect-error - 'notValid' is not in the values array
expValEqualsNoExposure('example-multivariate', 'variant', 'two', 'notValid');

// ❌ SHOULD FAIL: Wrong type (number instead of string)
// @ts-expect-error - number is not a valid type for this experiment
expValEquals('example-multivariate', 'variant', 1);

// @ts-expect-error - boolean is not a valid type for this experiment
expValEqualsNoExposure('example-multivariate', 'variant', true);

// ============================================================================
// Non-existent Experiment Tests
// ============================================================================

// ❌ SHOULD FAIL: Non-existent experiment name
// @ts-expect-error - 'non-existent-experiment' does not exist
expValEquals('non-existent-experiment', 'isEnabled', true);

// @ts-expect-error - 'fake-experiment' does not exist
expValEqualsNoExposure('fake-experiment', 'param', 'value');

// ============================================================================
// Type Inference Tests
// ============================================================================

// ✅ Return type should be boolean
expValEquals('example-boolean', 'isEnabled', true) satisfies boolean;
expValEqualsNoExposure('example-multivariate', 'variant', 'one') satisfies boolean;
