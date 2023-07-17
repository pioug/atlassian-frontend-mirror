export interface PackageJson {
  name: string;
  version: string;
  peerDependencies?: Dependency;
}

interface Dependency {
  [k: string]: string;
}
