const {
    createEvent,
    createIdentify,
    createPageview,
    createCache,
    getMeta,
    resetMeta,
    clone,
} = require('posthog-plugins/test/utils.js')
const { setupPlugin, processEvent } = require('../index')

beforeEach(() => {
    resetMeta({
        config: {
            netdata_version: 'v1.29.2',
        },
    })
})

test('setupPlugin', async () => {
    expect(getMeta().config.netdata_version).toEqual('v1.29.2')
    await setupPlugin(getMeta())
    expect(getMeta().global.setupDone).toEqual(true)
})

// test netdata_nightly logic
test('netdata_nightly', async () => {

    // create a eventNetdataNotNightly test event
    const eventNetdataNotNightly = createEvent({ event: 'test event', properties: { netdata_version: 'v1.29.2' } })
    const eventNetdataNotNightlyCopy = await processEvent(clone(eventNetdataNotNightly), getMeta())
    expect(eventNetdataNotNightlyCopy).toEqual({
        ...eventNetdataNotNightly,
        properties: {
            ...eventNetdataNotNightly.properties,
            netdata_nightly: false
        },
    })

    // create a eventNetdataNightly test event
    const eventNetdataNightly = createEvent({ event: 'test event', properties: { netdata_version: 'v1.29.2-25-nightly' } })
    const eventNetdataNightlyCopy = await processEvent(clone(eventNetdataNightly), getMeta())
    expect(eventNetdataNightlyCopy).toEqual({
        ...eventNetdataNightly,
        properties: {
            ...eventNetdataNightly.properties,
            netdata_nightly: true
        },
    })
})

// test collector module flags
test('collector_modules_flags', async () => {
    const event = createEvent({ event: 'test event', properties: { "host_collector_modules": "redis||web_log|/proc/diskstats|apps.plugin|||" } })
    const eventCopy = await processEvent(clone(event), getMeta())
    expect(eventCopy).toEqual({
        ...event,
        properties: {
            ...event.properties,
            host_collector_module_redis: true,
            host_collector_module_web_log: true,
            host_collector_module_proc_diskstats: true,
            host_collector_module_apps_plugin: true
        },
    })
})

// test collector plugin flags
test('collector_plugins_flags', async () => {
    const event = createEvent({ event: 'test event', properties: { "host_collector_plugins": "apps.plugin||idlejitter.plugin|||" } })
    const eventCopy = await processEvent(clone(event), getMeta())
    expect(eventCopy).toEqual({
        ...event,
        properties: {
            ...event.properties,
            host_collector_plugin_apps_plugin: true,
            host_collector_plugin_idlejitter_plugin: true
        },
    })
})

// test has_alarms_critical
test('has_alarms_critical', async () => {
    const event = createEvent({ event: 'test event', properties: { "alarms_critical": 1 } })
    const eventCopy = await processEvent(clone(event), getMeta())
    expect(eventCopy).toEqual({
        ...event,
        properties: {
            ...event.properties,
            has_alarms_critical: true
        },
    })
})

// test has_alarms_warning
test('has_alarms_warning', async () => {
    const event = createEvent({ event: 'test event', properties: { "alarms_warning": 1 } })
    const eventCopy = await processEvent(clone(event), getMeta())
    expect(eventCopy).toEqual({
        ...event,
        properties: {
            ...event.properties,
            has_alarms_warning: true
        },
    })
})

test('processEvent does not crash with identify', async () => {
    // create a random event
    const event0 = createIdentify()

    // must clone the event since `processEvent` will mutate it otherwise
    const event1 = await processEvent(clone(event0), getMeta())
    expect(event1).toEqual(event0)
})
