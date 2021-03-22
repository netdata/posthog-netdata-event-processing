# posthog-netdata-event-processing
A Posthog plugin to do some data processing on our Posthog events as they arrive.

## Description
An example of doing some event attribute processing using the PostHog plugin approach.

All logic and imports are defined in `process.js`. [rollup.js](https://rollupjs.org/guide/en/) is then used to generate the `index.js` file for the plugin. 

### index.js

To generate `index.js` use `rollup`:

```
rollup process.js --file index.js
```

### Tests

To run tests:

```
yarn test
```

