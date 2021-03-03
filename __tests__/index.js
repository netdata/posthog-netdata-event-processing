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

// test device_type Android
test('device_type_android', async () => {

    const event = createEvent({ event: 'test event', properties: { "$os": "Android" } })
    const eventCopy = await processEvent(clone(event), getMeta())
    expect(eventCopy).toEqual({
        ...event,
        properties: {
            ...event.properties,
            device_type: "Mobile"
        },
    })

})

// test device_type Windows
test('device_type_windows', async () => {

    const event = createEvent({ event: 'test event', properties: { "$os": "Windows" } })
    const eventCopy = await processEvent(clone(event), getMeta())
    expect(eventCopy).toEqual({
        ...event,
        properties: {
            ...event.properties,
            device_type: "Desktop"
        },
    })

})

// test collector flags
test('device_type_windows', async () => {

    const event = createEvent({ event: 'test event', properties: { "host_collector_modules": "dockerhub|||/proc/diskstats|postfix|/proc/softirqs|/proc/uptime|systemd|/proc/meminfo|||/proc/net/dev|/proc/net/stat/nf_conntrack|/proc/loadavg|ipc|/proc/net/sockstat|stats|stats|web_log|/proc/interrupts|/proc/net/snmp|ntpd|/sys/kernel/mm/ksm|/proc/stat" } })
    const eventCopy = await processEvent(clone(event), getMeta())
    expect(eventCopy).toEqual({
        ...event,
        properties: {
            ...event.properties,
            host_collector_redis: false,
            host_collector_web_log: true,
            host_collector_proc_diskstats: true
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
