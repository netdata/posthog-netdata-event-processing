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
    const event = createEvent({ event: 'test event', properties: { "alarms_warning": 0 } })
    const eventCopy = await processEvent(clone(event), getMeta())
    expect(eventCopy).toEqual({
        ...event,
        properties: {
            ...event.properties,
            has_alarms_warning: false
        },
    })
})

// test netdata_buildinfo
test('netdata_buildinfo', async () => {
    const event = createEvent({ event: 'test event', properties: { "netdata_buildinfo": "JSON-C|dbengine|Native HTTPS|LWS v3.2.2" } })
    const eventCopy = await processEvent(clone(event), getMeta())
    expect(eventCopy).toEqual({
        ...event,
        properties: {
            ...event.properties,
            netdata_buildinfo_json_c: true,
            netdata_buildinfo_dbengine: true,
            netdata_buildinfo_native_https: true,
            netdata_buildinfo_lws_v3_2_2: true,
        },
    })
})

// test host_collectors
test('host_collectors', async () => {
    const event = createEvent({
        event: 'test event',
        properties: {
            "host_collectors": [
                {
                    "plugin": "python.d.plugin",
                    "module": "dockerhub"
                },
                {
                    "plugin": "apps.plugin",
                    "module": ""
                },
                {
                    "plugin": "proc.plugin",
                    "module": "/proc/diskstats"
                },
                {
                    "plugin": "proc.plugin",
                    "module": "/proc/softirqs"
                },
            ]
        }
    })
    const eventCopy = await processEvent(clone(event), getMeta())
    expect(eventCopy).toEqual({
        ...event,
        properties: {
            ...event.properties,
            host_collector_plugin_python_d_plugin: true,
            host_collector_plugin_apps_plugin: true,
            host_collector_plugin_proc_plugin: true,
            host_collector_module_dockerhub: true,
            host_collector_module_proc_diskstats: true,
            host_collector_module_proc_softirqs: true,
        },
    })
})

// test netdata_machine_guid
test('netdata_machine_guid', async () => {
    const event = createEvent({ event: 'test event', properties: { "netdata_machine_guid": "" } })
    const eventCopy = await processEvent(clone(event), getMeta())
    expect(eventCopy).toEqual({
        ...event,
        properties: {
            netdata_machine_guid: 'empty',
            netdata_machine_guid_is_empty: true
        },
    })
})

// test netdata_machine_guid
test('netdata_machine_guid', async () => {
    const event = createEvent({ event: 'test event', properties: { "netdata_machine_guid": "123" } })
    const eventCopy = await processEvent(clone(event), getMeta())
    expect(eventCopy).toEqual({
        ...event,
        properties: {
            netdata_machine_guid: '123',
            netdata_machine_guid_is_empty: false
        },
    })
})

// test distinct_id
test('distinct_id', async () => {
    const event = createEvent({ event: 'test event', properties: { "distinct_id": "" } })
    const eventCopy = await processEvent(clone(event), getMeta())
    expect(eventCopy).toEqual({
        ...event,
        properties: {
            distinct_id: 'empty',
            distinct_id_is_empty: true
        },
    })
})

// test distinct_id
test('distinct_id', async () => {
    const event = createEvent({ event: 'test event', properties: { "distinct_id": "123" } })
    const eventCopy = await processEvent(clone(event), getMeta())
    expect(eventCopy).toEqual({
        ...event,
        properties: {
            distinct_id: '123',
            distinct_id_is_empty: false
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
