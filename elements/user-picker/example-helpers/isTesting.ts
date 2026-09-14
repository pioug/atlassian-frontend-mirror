// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling

export const isTesting = (): boolean => typeof jest !== 'undefined';
