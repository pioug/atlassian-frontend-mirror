// Ambient declaration for Atlaspack/Parcel url: prefix imports.
// The url: prefix instructs the bundler to emit the referenced file as a
// content-hashed asset and return its public URL as a string.
// For rspack, this is handled via staticAssetsLoader config.
declare module 'url:*' {
	const url: string;
	export default url;
}
