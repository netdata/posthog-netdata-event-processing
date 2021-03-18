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

// test netdata_person_id
test('netdata_person_id', async () => {
    const event = createEvent({ event: 'test event', properties: { "netdata_person_id": "" } })
    const eventCopy = await processEvent(clone(event), getMeta())
    expect(eventCopy).toEqual({
        ...event,
        properties: {
            netdata_person_id: 'empty',
            netdata_person_id_is_empty: true
        },
    })
})

// test netdata_person_id
test('netdata_person_id', async () => {
    const event = createEvent({ event: 'test event', properties: { "netdata_person_id": "123" } })
    const eventCopy = await processEvent(clone(event), getMeta())
    expect(eventCopy).toEqual({
        ...event,
        properties: {
            netdata_person_id: '123',
            netdata_person_id_is_empty: false
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


// test data_testid
test('data_testid', async () => {
    const eventExample = {
        "event": "$autocapture",
        "distinct_id": "dev-test",
        "properties": {},
        "$elements": [
            {
                "event": null,
                "text": "Last 6 hours",
                "tag_name": "div",
                "attr_class": [
                    "bNKkxa",
                    "styled__ShortPickElement-sc-1yj3701-7"
                ],
                "href": null,
                "attr_id": null,
                "nth_child": 6,
                "nth_of_type": 6,
                "attributes": {
                    "attr__class": "styled__ShortPickElement-sc-1yj3701-7 bNKkxa",
                    "attr__data-testid": "date-picker::click-quick-selector::::21600"
                },
                "order": 0
            },
            {
                "event": null,
                "text": null,
                "tag_name": "div",
                "attr_class": [
                    "bjKBDB",
                    "styled__ShortPick-sc-1yj3701-6"
                ],
                "href": null,
                "attr_id": null,
                "nth_child": 1,
                "nth_of_type": 1,
                "attributes": {
                    "attr__class": "styled__ShortPick-sc-1yj3701-6 bjKBDB"
                },
                "order": 1
            },
            {
                "event": null,
                "text": null,
                "tag_name": "div",
                "attr_class": [
                    "izBCiM",
                    "styled__PickerActionArea-sc-1yj3701-3"
                ],
                "href": null,
                "attr_id": null,
                "nth_child": 1,
                "nth_of_type": 1,
                "attributes": {
                    "attr__class": "styled__PickerActionArea-sc-1yj3701-3 izBCiM"
                },
                "order": 2
            },
            {
                "event": null,
                "text": null,
                "tag_name": "div",
                "attr_class": [
                    "dGUlEh",
                    "styled__PickerBox-sc-1yj3701-0"
                ],
                "href": null,
                "attr_id": null,
                "nth_child": 1,
                "nth_of_type": 1,
                "attributes": {
                    "attr__class": "styled__PickerBox-sc-1yj3701-0 dGUlEh"
                },
                "order": 3
            },
            {
                "event": null,
                "text": null,
                "tag_name": "aside",
                "attr_class": [
                    "iHSuaA",
                    "idivwh",
                    "sc-bdfBwQ",
                    "styled__PortalSidebox-l97ylu-3"
                ],
                "href": null,
                "attr_id": null,
                "nth_child": 1,
                "nth_of_type": 1,
                "attributes": {
                    "attr__class": "styled__PortalSidebox-l97ylu-3 iHSuaA sc-bdfBwQ idivwh"
                },
                "order": 4
            },
            {
                "event": null,
                "text": null,
                "tag_name": "div",
                "attr_class": [],
                "href": null,
                "attr_id": null,
                "nth_child": null,
                "nth_of_type": 1,
                "attributes": {
                    "attr__class": "\"attr__style=",
                    "--mdc-theme-on-primary:#FDFDFD; --mdc-theme-on-surface:#FFF; --mdc-theme-on-secondary:#FDFDFD; --mdc-theme-text-primary-on-background:#FFF; --mdc-theme-text-secondary-on-background:#ECEFF2; --mdc-theme-text-hint-on-background:#FFF; --mdc-theme-text-disabled-on-background:#383B40; --mdc-theme-text-icon-on-background:#FFF; --mdc-theme-background:#2B3136; --mdc-theme-surface:#2B3136; --mdc-theme-primary:#00AB44; --mdc-theme-secondary:#00CB51; --mdc-theme-error:#FF4136; --mdc-theme-on-error:#FDFDFD; --mdc-theme-text-primary-on-light:#35414A; --mdc-theme-text-secondary-on-light:#B5B9BC; --mdc-theme-text-hint-on-light:#35414A; --mdc-theme-text-disabled-on-light:#ECEFF2; --mdc-theme-text-icon-on-light:#35414A; --mdc-theme-text-primary-on-dark:#FFF; --mdc-theme-text-secondary-on-dark:#ECEFF2; --mdc-theme-text-hint-on-dark:#FFF; --mdc-theme-text-disabled-on-dark:#383B40; --mdc-theme-text-icon-on-dark:#FFF;\"nth-child": "2"
                },
                "order": 5
            },
            {
                "event": null,
                "text": null,
                "tag_name": "div",
                "attr_class": null,
                "href": null,
                "attr_id": null,
                "nth_child": 33,
                "nth_of_type": 23,
                "attributes": {},
                "order": 6
            },
            {
                "event": null,
                "text": null,
                "tag_name": "body",
                "attr_class": [],
                "href": null,
                "attr_id": null,
                "nth_child": 2,
                "nth_of_type": 1,
                "attributes": {
                    "attr__class": "\"attr__data-offset=",
                    "250\"attr__data-spy": "scroll",
                    "attr__data-target": "#sidebar"
                },
                "order": 7
            }
        ]
    }
    const event = createEvent(eventExample)
    const eventCopy = await processEvent(clone(event), getMeta())
    expect(eventCopy['properties']).toEqual({"data_testid": "date-picker::click-quick-selector::::21600"})
})


test('processEvent does not crash with identify', async () => {
    // create a random event
    const event0 = createIdentify()

    // must clone the event since `processEvent` will mutate it otherwise
    const event1 = await processEvent(clone(event0), getMeta())
    expect(event1).toEqual(event0)
})
