## Classes

<dl>
<dt><a href="#FeatureGates">FeatureGates</a></dt>
<dd><p>Access the FeatureGates object via the default export.</p>
<pre class="prettyprint source lang-ts"><code>import FeatureGates from '@atlaskit/feature-gate-js-client';
</code></pre></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Identifiers">Identifiers</a> : <code>object</code></dt>
<dd><p>The identifiers for the user. Options are restricted to the set that is currently supported.</p></dd>
<dt><a href="#CustomAttributes">CustomAttributes</a> : <code>object</code></dt>
<dd><p>The custom attributes for the user.</p></dd>
</dl>

## Interfaces

<dl>
<dt><a href="#BaseClientOptions">BaseClientOptions</a></dt>
<dd><p>Base client options.</p></dd>
<dt><a href="#ClientOptions">ClientOptions</a> ⇐ <code><a href="#BaseClientOptions">BaseClientOptions</a></code></dt>
<dd><p>The options for the client.</p></dd>
</dl>

<a name="BaseClientOptions"></a>

## BaseClientOptions

<p>Base client options.</p>

**Kind**: global interface  
**Properties**

| Name               | Type                                | Description                            |
| ------------------ | ----------------------------------- | -------------------------------------- |
| environment        | <code>FeatureGateEnvironment</code> | <p>The environment for the client.</p> |
| targetApp          | <code>string</code>                 | <p>The target app for the client.</p>  |
| analyticsWebClient | <code>AnalyticsWebClient</code>     | <p>The analytics web client.</p>       |

<a name="ClientOptions"></a>

## ClientOptions ⇐ [<code>BaseClientOptions</code>](#BaseClientOptions)

<p>The options for the client.</p>

**Kind**: global interface  
**Extends**: [<code>BaseClientOptions</code>](#BaseClientOptions)  
**Properties**

| Name           | Type                        | Description                                                                 |
| -------------- | --------------------------- | --------------------------------------------------------------------------- |
| apiKey         | <code>string</code>         | <p>The API key for the client.</p>                                          |
| fetchTimeoutMs | <code>fetchTimeoutMs</code> | <p>The timeout for the fetch request in milliseconds. Defaults to 5000.</p> |
| useGatewayURL  | <code>boolean</code>        | <p>Whether to use the gateway URL. Defaults to false.</p>                   |

<a name="FeatureGates"></a>

## FeatureGates

<p>Access the FeatureGates object via the default export.</p>
<pre class="prettyprint source lang-ts"><code>import FeatureGates from '@atlaskit/feature-gate-js-client';
</code></pre>

**Kind**: global class

- [FeatureGates](#FeatureGates)
  - [.initialize(clientOptions, identifiers, customAttributes)](#FeatureGates.initialize) ⇒ <code>Promise.&lt;void&gt;</code>
  - [.updateUser(fetchOptions, identifiers, customAttributes)](#FeatureGates.updateUser)
  - [.updateUserWithValues(identifiers, customAttributes, initializeValues)](#FeatureGates.updateUserWithValues)
  - [.checkGate(gateName)](#FeatureGates.checkGate)
  - [.getExperiment(experimentName, options)](#FeatureGates.getExperiment) ⇒
  - [.getExperimentValue(experimentName, parameterName, defaultValue, options)](#FeatureGates.getExperimentValue) ⇒
  - [.manuallyLogExperimentExposure(experimentName)](#FeatureGates.manuallyLogExperimentExposure)
  - [.overrideGate(gateName, value)](#FeatureGates.overrideGate)
  - [.clearGateOverride(gateName)](#FeatureGates.clearGateOverride)
  - [.overrideConfig(experimentName, values)](#FeatureGates.overrideConfig)
  - [.clearConfigOverride(experimentName)](#FeatureGates.clearConfigOverride)
  - [.setOverrides(overrides)](#FeatureGates.setOverrides)
  - [.clearAllOverrides()](#FeatureGates.clearAllOverrides)
  - [.isCurrentUser(identifiers, customAttributes)](#FeatureGates.isCurrentUser) ⇒
  - [.getPackageVersion()](#FeatureGates.getPackageVersion) ⇒
  - [.initialize(clientOptions, identifiers, customAttributes)](#FeatureGates.initialize) ⇒ <code>Promise.&lt;void&gt;</code>
  - [.updateUser(fetchOptions, identifiers, customAttributes)](#FeatureGates.updateUser) ⇒ <code>Promise.&lt;void&gt;</code>
  - [.updateUserWithValues(identifiers, customAttributes, initializeValues)](#FeatureGates.updateUserWithValues) ⇒ <code>Promise.&lt;void&gt;</code>
  - [.checkGate(gateName)](#FeatureGates.checkGate) ⇒ <code>boolean</code>
  - [.getExperiment(experimentName, options)](#FeatureGates.getExperiment) ⇒
  - [.getExperimentValue(experimentName, parameterName, defaultValue, options)](#FeatureGates.getExperimentValue) ⇒
  - [.manuallyLogExperimentExposure(experimentName)](#FeatureGates.manuallyLogExperimentExposure) ⇒ <code>void</code>
  - [.overrideGate(gateName, value)](#FeatureGates.overrideGate) ⇒ <code>void</code>
  - [.clearGateOverride(gateName)](#FeatureGates.clearGateOverride) ⇒ <code>void</code>
  - [.overrideConfig(experimentName, values)](#FeatureGates.overrideConfig) ⇒ <code>void</code>
  - [.clearConfigOverride(experimentName)](#FeatureGates.clearConfigOverride) ⇒ <code>void</code>
  - [.setOverrides(overrides)](#FeatureGates.setOverrides) ⇒ <code>void</code>
  - [.clearAllOverrides()](#FeatureGates.clearAllOverrides) ⇒ <code>void</code>
  - [.isCurrentUser(identifiers, customAttributes)](#FeatureGates.isCurrentUser) ⇒
  - [.getPackageVersion()](#FeatureGates.getPackageVersion) ⇒

<a name="FeatureGates.initialize"></a>

### FeatureGates.initialize(clientOptions, identifiers, customAttributes) ⇒ <code>Promise.&lt;void&gt;</code>

<p>This method initializes the client using a network call to fetch the bootstrap values.
If the client is inialized with an <code>analyticsWebClient</code>, it will send an operational event
to GASv3 with the following attributes:</p>
<ul>
<li>targetApp: the target app of the client</li>
<li>clientVersion: the version of the client</li>
<li>success: whether the initialization was successful</li>
<li>startTime: the time when the initialization started</li>
<li>totalTime: the total time it took to initialize the client</li>
<li>apiKey: the api key used to initialize the client</li>
</ul>

**Kind**: static method of [<code>FeatureGates</code>](#FeatureGates)

| Param            | Type                                               |
| ---------------- | -------------------------------------------------- |
| clientOptions    | [<code>ClientOptions</code>](#ClientOptions)       |
| identifiers      | [<code>Identifiers</code>](#Identifiers)           |
| customAttributes | [<code>CustomAttributes</code>](#CustomAttributes) |

<a name="FeatureGates.updateUser"></a>

### FeatureGates.updateUser(fetchOptions, identifiers, customAttributes)

<p>This method updates the user using a network call to fetch the new set of values.</p>

**Kind**: static method of [<code>FeatureGates</code>](#FeatureGates)

| Param            | Type                                               |
| ---------------- | -------------------------------------------------- |
| fetchOptions     | <code>FetcherOptions</code>                        |
| identifiers      | [<code>Identifiers</code>](#Identifiers)           |
| customAttributes | [<code>CustomAttributes</code>](#CustomAttributes) |

<a name="FeatureGates.updateUserWithValues"></a>

### FeatureGates.updateUserWithValues(identifiers, customAttributes, initializeValues)

<p>This method updates the user given a new set of bootstrap values obtained from one of the server-side SDKs.</p>

**Kind**: static method of [<code>FeatureGates</code>](#FeatureGates)

| Param            | Type                                               |
| ---------------- | -------------------------------------------------- |
| identifiers      | [<code>Identifiers</code>](#Identifiers)           |
| customAttributes | [<code>CustomAttributes</code>](#CustomAttributes) |
| initializeValues | <code>Record.&lt;string, unknown&gt;</code>        |

<a name="FeatureGates.checkGate"></a>

### FeatureGates.checkGate(gateName)

<p>Returns the value for a feature gate. Returns false if there are errors.</p>

**Kind**: static method of [<code>FeatureGates</code>](#FeatureGates)

| Param    | Description                          |
| -------- | ------------------------------------ |
| gateName | <p>The name of the feature gate.</p> |

<a name="FeatureGates.getExperiment"></a>

### FeatureGates.getExperiment(experimentName, options) ⇒

<p>Returns the entire config for a given experiment.</p>

**Kind**: static method of [<code>FeatureGates</code>](#FeatureGates)  
**Returns**: <p>The config for an experiment</p>

| Param                          | Type                 | Description                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------ | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| experimentName                 | <code>string</code>  | <p>The name of the experiment</p>                                                                                                                                                                                                                                                                                                                           |
| options                        | <code>Object</code>  |                                                                                                                                                                                                                                                                                                                                                             |
| options.fireExperimentExposure | <code>boolean</code> | <p>Whether or not to fire the exposure event for the experiment. Defaults to true. To log an exposure event manually at a later time, use [manuallyLogExperimentExposure](#FeatureGates.manuallyLogExperimentExposure) (see <a href="https://docs.statsig.com/client/jsClientSDK#manual-exposures-">Statsig docs about manually logging exposures</a>).</p> |

**Example**

```ts
const experimentConfig = FeatureGates.getExperiment('example-experiment-name');
const backgroundColor: string = experimentConfig.get(
  'backgroundColor',
  'yellow',
);
```

<a name="FeatureGates.getExperimentValue"></a>

### FeatureGates.getExperimentValue(experimentName, parameterName, defaultValue, options) ⇒

<p>Returns the value of a given parameter in an experiment config.</p>

**Kind**: static method of [<code>FeatureGates</code>](#FeatureGates)  
**Returns**: <p>The value of the parameter if the experiment and parameter both exist, otherwise the default value.</p>

| Param                          | Type                  | Description                                                                                                                                                                                                                                                                                                                                                |
| ------------------------------ | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| experimentName                 | <code>string</code>   | <p>The name of the experiment</p>                                                                                                                                                                                                                                                                                                                          |
| parameterName                  | <code>string</code>   | <p>The name of the parameter to fetch from the experiment config</p>                                                                                                                                                                                                                                                                                       |
| defaultValue                   | <code>T</code>        | <p>The value to serve if the experiment or parameter do not exist, or if the returned value does not match the expected type.</p>                                                                                                                                                                                                                          |
| options                        | <code>Object</code>   |                                                                                                                                                                                                                                                                                                                                                            |
| options.fireExperimentExposure | <code>boolean</code>  | <p>Whether or not to fire the exposure event for the experiment. Defaults to true. To log an exposure event manually at a later time, use [manuallyLogExperimentExposure](#FeatureGates.manuallyLogExperimentExposure) (see <a href="https://docs.statsig.com/client/jsClientSDK#manual-exposures-">Statsig docs about manually logging exposures</a>)</p> |
| options.typeGuard              | <code>function</code> | <p>A function that asserts that the return value has the expected type. If this function returns false, then the default value will be returned instead. This can be set to protect your code from unexpected values being set remotely. By default, this will be done by asserting that the default value and value are the same primitive type.</p>      |

**Example**

````ts
     type ValidColor = 'blue' | 'red' | 'yellow';
     type ValidColorTypeCheck = (value: unknown) => value is ValidColor;

     const isValidColor: ValidColorTypeCheck =
        (value: unknown) => typeof value === 'string' && ['blue', 'red', 'yellow'].includes(value);

     const buttonColor: ValidColor = FeatureGates.getExperimentValue(
        'example-experiment-name',
        'backgroundColor',
        'yellow',
        {
            typeGuard: isValidColor
        }
     );
     ```
<a name="FeatureGates.manuallyLogExperimentExposure"></a>

### FeatureGates.manuallyLogExperimentExposure(experimentName)
<p>Manually log an experiment exposure (see <a href="https://docs.statsig.com/client/jsClientSDK#manual-exposures-">Statsig docs about manually logging exposures</a>).
This is useful if you have evaluated an experiment earlier via [getExperimentValue](#FeatureGates.getExperimentValue) or
[getExperiment](#FeatureGates.getExperiment) where <code>options.fireExperimentExposure</code> is false.</p>

**Kind**: static method of [<code>FeatureGates</code>](#FeatureGates)

| Param |
| --- |
| experimentName |

<a name="FeatureGates.overrideGate"></a>

### FeatureGates.overrideGate(gateName, value)
<p>Adds a new override for the given gate.</p>
<p>This method is additive, meaning you can call it multiple times with different gate names to build
your full set of overrides.</p>
<p>Overrides are persisted to the <code>STATSIG_JS_LITE_LOCAL_OVERRIDES</code> key in localStorage, so they will
continue to affect every client that is initialized on the same domain after this method is called.
If you are using this API for testing purposes, you should call $[clearGateOverride](#FeatureGates.clearGateOverride) after
your tests are completed to remove this localStorage entry.</p>

**Kind**: static method of [<code>FeatureGates</code>](#FeatureGates)

| Param | Type |
| --- | --- |
| gateName | <code>string</code> |
| value | <code>boolean</code> |

<a name="FeatureGates.clearGateOverride"></a>

### FeatureGates.clearGateOverride(gateName)
<p>Removes any overrides that have been set for the given gate.</p>

**Kind**: static method of [<code>FeatureGates</code>](#FeatureGates)

| Param | Type |
| --- | --- |
| gateName | <code>string</code> |

<a name="FeatureGates.overrideConfig"></a>

### FeatureGates.overrideConfig(experimentName, values)
<p>Adds a new override for the given config (or experiment).</p>
<p>This method is additive, meaning you can call it multiple times with different experiment names to build
your full set of overrides.</p>
<p>Overrides are persisted to the <code>STATSIG_JS_LITE_LOCAL_OVERRIDES</code> key in localStorage, so they will
continue to affect every client that is initialized on the same domain after this method is called.
If you are using this API for testing purposes, you should call $[clearConfigOverride](#FeatureGates.clearConfigOverride) after
your tests are completed to remove this localStorage entry.</p>

**Kind**: static method of [<code>FeatureGates</code>](#FeatureGates)

| Param | Type |
| --- | --- |
| experimentName | <code>string</code> |
| values | <code>object</code> |

<a name="FeatureGates.clearConfigOverride"></a>

### FeatureGates.clearConfigOverride(experimentName)
<p>Removes any overrides that have been set for the given experiment.</p>

**Kind**: static method of [<code>FeatureGates</code>](#FeatureGates)

| Param | Type |
| --- | --- |
| experimentName | <code>string</code> |

<a name="FeatureGates.setOverrides"></a>

### FeatureGates.setOverrides(overrides)
<p>Set overrides for gates, experiments and layers in batch.</p>
<p>Note that these overrides are <strong>not</strong> additive and will completely replace any that have been added
via prior calls to [overrideConfig](#FeatureGates.overrideConfig) or [overrideGate](#FeatureGates.overrideGate).</p>
<p>Overrides are persisted to the <code>STATSIG_JS_LITE_LOCAL_OVERRIDES</code> key in localStorage, so they will
continue to affect every client that is initialized on the same domain after this method is called.
If you are using this API for testing purposes, you should call $[clearAllOverrides](#FeatureGates.clearAllOverrides) after
your tests are completed to remove this localStorage entry.</p>

**Kind**: static method of [<code>FeatureGates</code>](#FeatureGates)

| Param | Type |
| --- | --- |
| overrides | <code>object</code> |

<a name="FeatureGates.clearAllOverrides"></a>

### FeatureGates.clearAllOverrides()
<p>Clears overrides for all gates, configs (including experiments) and layers.</p>

**Kind**: static method of [<code>FeatureGates</code>](#FeatureGates)
<a name="FeatureGates.isCurrentUser"></a>

### FeatureGates.isCurrentUser(identifiers, customAttributes) ⇒
<p>Returns whether the given identifiers and customAttributes align with the current
set that is being used by the client.</p>
<p>If this method returns false, then the [updateUser](#FeatureGates.updateUser) or [updateUserWithValues](#FeatureGates.updateUserWithValues)
methods can be used to re-align these values.</p>

**Kind**: static method of [<code>FeatureGates</code>](#FeatureGates)
**Returns**: <p>a flag indicating whether the clients current configuration aligns with the given values</p>

| Param |
| --- |
| identifiers |
| customAttributes |

<a name="FeatureGates.getPackageVersion"></a>

### FeatureGates.getPackageVersion() ⇒
**Kind**: static method of [<code>FeatureGates</code>](#FeatureGates)
**Returns**: <p>string version of the current package in semver style.</p>
<a name="FeatureGates.initialize"></a>

### FeatureGates.initialize(clientOptions, identifiers, customAttributes) ⇒ <code>Promise.&lt;void&gt;</code>
<p>This method initializes the client using a network call to fetch the bootstrap values.
If the client is inialized with an <code>analyticsWebClient</code>, it will send an operational event
to GASv3 with the following attributes:</p>
<ul>
<li>targetApp: the target app of the client</li>
<li>clientVersion: the version of the client</li>
<li>success: whether the initialization was successful</li>
<li>startTime: the time when the initialization started</li>
<li>totalTime: the total time it took to initialize the client</li>
<li>apiKey: the api key used to initialize the client</li>
</ul>

**Kind**: static method of [<code>FeatureGates</code>](#FeatureGates)

| Param | Type |
| --- | --- |
| clientOptions | [<code>ClientOptions</code>](#ClientOptions) |
| identifiers | [<code>Identifiers</code>](#Identifiers) |
| customAttributes | [<code>CustomAttributes</code>](#CustomAttributes) |

<a name="FeatureGates.updateUser"></a>

### FeatureGates.updateUser(fetchOptions, identifiers, customAttributes) ⇒ <code>Promise.&lt;void&gt;</code>
<p>This method updates the user using a network call to fetch the new set of values.</p>

**Kind**: static method of [<code>FeatureGates</code>](#FeatureGates)

| Param | Type |
| --- | --- |
| fetchOptions | <code>FetcherOptions</code> |
| identifiers | [<code>Identifiers</code>](#Identifiers) |
| customAttributes | [<code>CustomAttributes</code>](#CustomAttributes) |

<a name="FeatureGates.updateUserWithValues"></a>

### FeatureGates.updateUserWithValues(identifiers, customAttributes, initializeValues) ⇒ <code>Promise.&lt;void&gt;</code>
<p>This method updates the user given a new set of bootstrap values obtained from one of the server-side SDKs.</p>

**Kind**: static method of [<code>FeatureGates</code>](#FeatureGates)

| Param | Type |
| --- | --- |
| identifiers | [<code>Identifiers</code>](#Identifiers) |
| customAttributes | [<code>CustomAttributes</code>](#CustomAttributes) |
| initializeValues | <code>Record.&lt;string, unknown&gt;</code> |

<a name="FeatureGates.checkGate"></a>

### FeatureGates.checkGate(gateName) ⇒ <code>boolean</code>
<p>Returns the value for a feature gate. Returns false if there are errors.</p>

**Kind**: static method of [<code>FeatureGates</code>](#FeatureGates)

| Param | Description |
| --- | --- |
| gateName | <p>The name of the feature gate.</p> |

<a name="FeatureGates.getExperiment"></a>

### FeatureGates.getExperiment(experimentName, options) ⇒
<p>Returns the entire config for a given experiment.</p>

**Kind**: static method of [<code>FeatureGates</code>](#FeatureGates)
**Returns**: <p>The config for an experiment</p>

| Param | Type | Description |
| --- | --- | --- |
| experimentName | <code>string</code> | <p>The name of the experiment</p> |
| options | <code>Object</code> |  |
| options.fireExperimentExposure | <code>boolean</code> | <p>Whether or not to fire the exposure event for the experiment. Defaults to true. To log an exposure event manually at a later time, use [manuallyLogExperimentExposure](#FeatureGates.manuallyLogExperimentExposure) (see <a href="https://docs.statsig.com/client/jsClientSDK#manual-exposures-">Statsig docs about manually logging exposures</a>).</p> |

**Example**
```ts
const experimentConfig = FeatureGates.getExperiment('example-experiment-name');
const backgroundColor: string = experimentConfig.get('backgroundColor', 'yellow');
````

<a name="FeatureGates.getExperimentValue"></a>

### FeatureGates.getExperimentValue(experimentName, parameterName, defaultValue, options) ⇒

<p>Returns the value of a given parameter in an experiment config.</p>

**Kind**: static method of [<code>FeatureGates</code>](#FeatureGates)  
**Returns**: <p>The value of the parameter if the experiment and parameter both exist, otherwise the default value.</p>

| Param                          | Type                  | Description                                                                                                                                                                                                                                                                                                                                                |
| ------------------------------ | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| experimentName                 | <code>string</code>   | <p>The name of the experiment</p>                                                                                                                                                                                                                                                                                                                          |
| parameterName                  | <code>string</code>   | <p>The name of the parameter to fetch from the experiment config</p>                                                                                                                                                                                                                                                                                       |
| defaultValue                   | <code>T</code>        | <p>The value to serve if the experiment or parameter do not exist, or if the returned value does not match the expected type.</p>                                                                                                                                                                                                                          |
| options                        | <code>Object</code>   |                                                                                                                                                                                                                                                                                                                                                            |
| options.fireExperimentExposure | <code>boolean</code>  | <p>Whether or not to fire the exposure event for the experiment. Defaults to true. To log an exposure event manually at a later time, use [manuallyLogExperimentExposure](#FeatureGates.manuallyLogExperimentExposure) (see <a href="https://docs.statsig.com/client/jsClientSDK#manual-exposures-">Statsig docs about manually logging exposures</a>)</p> |
| options.typeGuard              | <code>function</code> | <p>A function that asserts that the return value has the expected type. If this function returns false, then the default value will be returned instead. This can be set to protect your code from unexpected values being set remotely. By default, this will be done by asserting that the default value and value are the same primitive type.</p>      |

**Example**

````ts
     type ValidColor = 'blue' | 'red' | 'yellow';
     type ValidColorTypeCheck = (value: unknown) => value is ValidColor;

     const isValidColor: ValidColorTypeCheck =
        (value: unknown) => typeof value === 'string' && ['blue', 'red', 'yellow'].includes(value);

     const buttonColor: ValidColor = FeatureGates.getExperimentValue(
        'example-experiment-name',
        'backgroundColor',
        'yellow',
        {
            typeGuard: isValidColor
        }
     );
     ```
<a name="FeatureGates.manuallyLogExperimentExposure"></a>

### FeatureGates.manuallyLogExperimentExposure(experimentName) ⇒ <code>void</code>
<p>Manually log an experiment exposure (see <a href="https://docs.statsig.com/client/jsClientSDK#manual-exposures-">Statsig docs about manually logging exposures</a>).
This is useful if you have evaluated an experiment earlier via [getExperimentValue](#FeatureGates.getExperimentValue) or
[getExperiment](#FeatureGates.getExperiment) where <code>options.fireExperimentExposure</code> is false.</p>

**Kind**: static method of [<code>FeatureGates</code>](#FeatureGates)

| Param |
| --- |
| experimentName |

<a name="FeatureGates.overrideGate"></a>

### FeatureGates.overrideGate(gateName, value) ⇒ <code>void</code>
<p>Adds a new override for the given gate.</p>
<p>This method is additive, meaning you can call it multiple times with different gate names to build
your full set of overrides.</p>
<p>Overrides are persisted to the <code>STATSIG_JS_LITE_LOCAL_OVERRIDES</code> key in localStorage, so they will
continue to affect every client that is initialized on the same domain after this method is called.
If you are using this API for testing purposes, you should call $[clearGateOverride](#FeatureGates.clearGateOverride) after
your tests are completed to remove this localStorage entry.</p>

**Kind**: static method of [<code>FeatureGates</code>](#FeatureGates)

| Param | Type |
| --- | --- |
| gateName | <code>string</code> |
| value | <code>boolean</code> |

<a name="FeatureGates.clearGateOverride"></a>

### FeatureGates.clearGateOverride(gateName) ⇒ <code>void</code>
<p>Removes any overrides that have been set for the given gate.</p>

**Kind**: static method of [<code>FeatureGates</code>](#FeatureGates)

| Param | Type |
| --- | --- |
| gateName | <code>string</code> |

<a name="FeatureGates.overrideConfig"></a>

### FeatureGates.overrideConfig(experimentName, values) ⇒ <code>void</code>
<p>Adds a new override for the given config (or experiment).</p>
<p>This method is additive, meaning you can call it multiple times with different experiment names to build
your full set of overrides.</p>
<p>Overrides are persisted to the <code>STATSIG_JS_LITE_LOCAL_OVERRIDES</code> key in localStorage, so they will
continue to affect every client that is initialized on the same domain after this method is called.
If you are using this API for testing purposes, you should call $[clearConfigOverride](#FeatureGates.clearConfigOverride) after
your tests are completed to remove this localStorage entry.</p>

**Kind**: static method of [<code>FeatureGates</code>](#FeatureGates)

| Param | Type |
| --- | --- |
| experimentName | <code>string</code> |
| values | <code>object</code> |

<a name="FeatureGates.clearConfigOverride"></a>

### FeatureGates.clearConfigOverride(experimentName) ⇒ <code>void</code>
<p>Removes any overrides that have been set for the given experiment.</p>

**Kind**: static method of [<code>FeatureGates</code>](#FeatureGates)

| Param | Type |
| --- | --- |
| experimentName | <code>string</code> |

<a name="FeatureGates.setOverrides"></a>

### FeatureGates.setOverrides(overrides) ⇒ <code>void</code>
<p>Set overrides for gates, experiments and layers in batch.</p>
<p>Note that these overrides are <strong>not</strong> additive and will completely replace any that have been added
via prior calls to [overrideConfig](#FeatureGates.overrideConfig) or [overrideGate](#FeatureGates.overrideGate).</p>
<p>Overrides are persisted to the <code>STATSIG_JS_LITE_LOCAL_OVERRIDES</code> key in localStorage, so they will
continue to affect every client that is initialized on the same domain after this method is called.
If you are using this API for testing purposes, you should call $[clearAllOverrides](#FeatureGates.clearAllOverrides) after
your tests are completed to remove this localStorage entry.</p>

**Kind**: static method of [<code>FeatureGates</code>](#FeatureGates)

| Param | Type |
| --- | --- |
| overrides | <code>object</code> |

<a name="FeatureGates.clearAllOverrides"></a>

### FeatureGates.clearAllOverrides() ⇒ <code>void</code>
<p>Clears overrides for all gates, configs (including experiments) and layers.</p>

**Kind**: static method of [<code>FeatureGates</code>](#FeatureGates)
<a name="FeatureGates.isCurrentUser"></a>

### FeatureGates.isCurrentUser(identifiers, customAttributes) ⇒
<p>Returns whether the given identifiers and customAttributes align with the current
set that is being used by the client.</p>
<p>If this method returns false, then the [updateUser](#FeatureGates.updateUser) or [updateUserWithValues](#FeatureGates.updateUserWithValues)
methods can be used to re-align these values.</p>

**Kind**: static method of [<code>FeatureGates</code>](#FeatureGates)
**Returns**: <p>a flag indicating whether the clients current configuration aligns with the given values</p>

| Param |
| --- |
| identifiers |
| customAttributes |

<a name="FeatureGates.getPackageVersion"></a>

### FeatureGates.getPackageVersion() ⇒
**Kind**: static method of [<code>FeatureGates</code>](#FeatureGates)
**Returns**: <p>string version of the current package in semver style.</p>
<a name="Identifiers"></a>

## Identifiers : <code>object</code>
<p>The identifiers for the user. Options are restricted to the set that is currently supported.</p>

**Kind**: global typedef
**Properties**

| Name | Type |
| --- | --- |
| [analyticsAnonymousId] | <code>string</code> |
| [atlassianAccountId] | <code>string</code> |
| [atlassianOrgId] | <code>string</code> |
| [gsacIssueId] | <code>string</code> |
| [intercomConversationId] | <code>string</code> |
| [marketplaceAnonymousId] | <code>string</code> |
| [marketplacePartnerId] | <code>string</code> |
| [msTeamsTenantId] | <code>string</code> |
| [randomizationId] | <code>string</code> |
| [tenantId] | <code>string</code> |
| [transactionAccountId] | <code>string</code> |
| [trelloUserId] | <code>string</code> |
| [trelloWorkspaceId] | <code>string</code> |

<a name="CustomAttributes"></a>

## CustomAttributes : <code>object</code>
<p>The custom attributes for the user.</p>

**Kind**: global typedef
**Properties**

| Name | Type |
| --- | --- |
| {...} | <code>string</code> \| <code>number</code> \| <code>boolean</code> \| <code>Array.&lt;string&gt;</code> |

````
