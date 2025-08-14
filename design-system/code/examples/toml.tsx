import React from 'react';

import { CodeBlock } from '@atlaskit/code';

const exampleCodeBlock = `[package]
name = "my-project"
version = "0.1.0"
edition = "2021"
authors = ["John Doe <john@example.com>"]
description = "A sample TOML configuration"

[dependencies]
serde = { version = "1.0", features = ["derive"] }
tokio = { version = "1.0", features = ["full"] }

[dev-dependencies]
criterion = "0.3"

[[bin]]
name = "main"
path = "src/main.rs"

[profile.release]
opt-level = 3
lto = true`;

export default function Component() {
	return (
		<div>
			<h2>TOML</h2>
			<CodeBlock language="toml" text={exampleCodeBlock} />
		</div>
	);
}
