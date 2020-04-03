import { coerce } from 'semver';

export function updateVersionRange(
  oldVersionRange: string,
  newVersion: string,
) {
  return oldVersionRange.replace(
    coerce(oldVersionRange)!.version,
    coerce(newVersion)!.version,
  );
}
