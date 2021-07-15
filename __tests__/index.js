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

const netdataPluginVersion = '0.0.1'

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

// test has_alarms_critical
test('has_alarms_critical', async () => {
    const event = createEvent({ event: 'test event', properties: { "alarms_critical": 1 } })
    const eventCopy = await processEvent(clone(event), getMeta())
    expect(eventCopy).toEqual({
        ...event,
        properties: {
            ...event.properties,
            has_alarms_critical: true,
            netdata_posthog_plugin_version: netdataPluginVersion,
            interaction_type: 'other',
            interaction_detail: '',
            interaction_token: 'other|',
            event_ph: 'test event'
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
            has_alarms_warning: false,
            netdata_posthog_plugin_version: netdataPluginVersion,
            interaction_type: 'other',
            interaction_detail: '',
            interaction_token: 'other|',
            event_ph: 'test event'
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
            netdata_posthog_plugin_version: netdataPluginVersion,
            interaction_type: 'other',
            interaction_detail: '',
            interaction_token: 'other|',
            event_ph: 'test event'
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
            netdata_posthog_plugin_version: netdataPluginVersion,
            interaction_type: 'other',
            interaction_detail: '',
            interaction_token: 'other|',
            event_ph: 'test event'
        },
    })
})

// test host_collectors null
test('host_collectors_null', async () => {
    const event = createEvent({
        event: 'test event',
        properties: {
            "host_collectors": [null]
        }
    })
    const eventCopy = await processEvent(clone(event), getMeta())
    expect(eventCopy).toEqual({
        ...event,
        properties: {
            ...event.properties,
            netdata_posthog_plugin_version: netdataPluginVersion,
            interaction_type: 'other',
            interaction_detail: '',
            interaction_token: 'other|',
            event_ph: 'test event'
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
            netdata_machine_guid_is_empty: true,
            netdata_posthog_plugin_version: netdataPluginVersion,
            interaction_type: 'other',
            interaction_detail: '',
            interaction_token: 'other|',
            event_ph: 'test event'
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
            netdata_machine_guid_is_empty: false,
            netdata_posthog_plugin_version: netdataPluginVersion,
            interaction_type: 'other',
            interaction_detail: '',
            interaction_token: 'other|',
            event_ph: 'test event'
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
            netdata_person_id_is_empty: true,
            netdata_posthog_plugin_version: netdataPluginVersion,
            interaction_type: 'other',
            interaction_detail: '',
            interaction_token: 'other|',
            event_ph: 'test event'
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
            netdata_person_id_is_empty: false,
            netdata_posthog_plugin_version: netdataPluginVersion,
            interaction_type: 'other',
            interaction_detail: '',
            interaction_token: 'other|',
            event_ph: 'test event'
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
            distinct_id_is_empty: true,
            netdata_posthog_plugin_version: netdataPluginVersion,
            interaction_type: 'other',
            interaction_detail: '',
            interaction_token: 'other|',
            event_ph: 'test event'
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
            distinct_id_is_empty: false,
            netdata_posthog_plugin_version: netdataPluginVersion,
            interaction_type: 'other',
            interaction_detail: '',
            interaction_token: 'other|',
            event_ph: 'test event'
        },
    })
})


// test data_testid
test('data_testid', async () => {
    const eventExample = {
        "event": "$autocapture",
        "distinct_id": "dev-test",
        "properties": {
            "$elements": [
                {
                    "attr__data-testid": "date-picker::click-quick-selector::::21600",
                },
                {
                    "attr__href": "#menu_web_log_nginx"
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
                    "text": "unshared",
                    "tag_name": "span",
                    "attr_class": [
                        "chart-legend-bottomstyled__DimensionLabel-ltgk2z-9",
                        "iMmOhf"
                    ],
                    "href": null,
                    "attr_id": null,
                    "nth_child": 2,
                    "nth_of_type": 1,
                    "attributes": {
                        "attr__class": "chart-legend-bottomstyled__DimensionLabel-ltgk2z-9 iMmOhf"
                    },
                    "order": 0
                },
                {
                    "$el_text": "unshared"
                },
                {
                    "event": null,
                    "text": "unshared",
                    "tag_name": "span",
                    "attr_class": [
                        "chart-legend-bottomstyled__DimensionLabel-ltgk2z-9",
                        "iMmOhf"
                    ],
                    "href": null,
                    "attr_id": null,
                    "nth_child": 2,
                    "nth_of_type": 1,
                    "attributes": {
                        "attr__class": "chart-legend-bottomstyled__DimensionLabel-ltgk2z-9 iMmOhf"
                    },
                    "order": 0

                },
                {
                    "attr__data-id": "newyork_netdata_rocks_mem_ksm",
                    "attr__data-legend-position": "bottom",
                    "attr__data-netdata": "mem.ksm",
                }
            ]
        }
    }
    const event = createEvent(eventExample)
    const eventCopy = await processEvent(clone(event), getMeta())
    expect(eventCopy['properties']['el_data_testid']).toEqual("date-picker::click-quick-selector::::21600")
    expect(eventCopy['properties']['el_href_menu']).toEqual("#menu_web_log_nginx")
    expect(eventCopy['properties']['el_text']).toEqual("unshared")
    expect(eventCopy['properties']['el_data_netdata']).toEqual("mem.ksm")
    expect(eventCopy['properties']['interaction_type']).toEqual("menu")
})

// test menu
test('menu', async () => {
    const event = createEvent({ event: 'test event', properties: {"$elements":[{"attr__href": "#menu_system_submenu_cpu"}]} })
    const eventCopy = await processEvent(clone(event), getMeta())
    expect(eventCopy).toEqual({
        ...event,
        properties: {
            ...event.properties,
            el_href: '#menu_system_submenu_cpu',
            el_href_menu: '#menu_system_submenu_cpu',
            el_menu: 'system',
            el_submenu: 'cpu',
            netdata_posthog_plugin_version: netdataPluginVersion,
            interaction_type: 'submenu',
            interaction_detail: '#menu_system_submenu_cpu',
            interaction_token: 'submenu|#menu_system_submenu_cpu',
            event_ph: 'test event'
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

// test config_https_available
test('config_https_available', async () => {
    const event = createEvent({ event: 'test event', properties: { "config_https_available": "||web" } })
    const eventCopy = await processEvent(clone(event), getMeta())
    expect(eventCopy).toEqual({
        ...event,
        properties: {
            ...event.properties,
            config_https_available_web: true,
            netdata_posthog_plugin_version: netdataPluginVersion,
            interaction_type: 'other',
            interaction_detail: '',
            interaction_token: 'other|',
            event_ph: 'test event'
        },
    })
})

// test config_https_available
test('real_event', async () => {
    const event = createEvent({
        event: 'test event',
        properties: {
          "ip": "127.0.0.1",
          "now": "2021-06-17T18:51:31.722998+00:00",
          "uuid": "017a1b50-6612-0000-483c-75d78329910e",
          "event": "META -",
          "api_key": "mqkwGT0JNFqO-zX2t0mW6Tec9yooaVu7xCBlXtHnt5Y",
          "sent_at": "",
          "team_id": 2,
          "site_url": "https://posthog.netdata.cloud",
          "properties": {
            "$ip": "127.0.0.1",
            "$host": "backend.netdata.io",
            "action": "META",
            "event_ph": "META -",
            "$pathname": "netdata-backend",
            "host_os_id": "ubuntu",
            "action_data": "-",
            "distinct_id": "1db705aa-47ba-11eb-835e-d9622a2f61da",
            "$current_url": "agent backend",
            "event_source": "agent backend",
            "host_os_name": "Ubuntu",
            "action_result": "-",
            "alarms_normal": 108,
            "alarms_warning": 0,
            "alarms_critical": 0,
            "container_os_id": "none",
            "host_collectors": [
              {
                "module": "stats",
                "plugin": "proc"
              },
              {
                "module": "/proc/pressure",
                "plugin": "proc.plugin"
              },
              {
                "module": "",
                "plugin": "apps.plugin"
              },
              {
                "module": "/proc/diskstats",
                "plugin": "proc.plugin"
              },
              {
                "module": "/proc/softirqs",
                "plugin": "proc.plugin"
              },
              {
                "module": "/proc/uptime",
                "plugin": "proc.plugin"
              },
              {
                "module": "systemd",
                "plugin": "cgroups.plugin"
              },
              {
                "module": "/proc/meminfo",
                "plugin": "proc.plugin"
              },
              {
                "module": "",
                "plugin": "tc.plugin"
              },
              {
                "module": "",
                "plugin": "idlejitter.plugin"
              },
              {
                "module": "/proc/net/dev",
                "plugin": "proc.plugin"
              },
              {
                "module": "/proc/net/stat/nf_conntrack",
                "plugin": "proc.plugin"
              },
              {
                "module": "/proc/loadavg",
                "plugin": "proc.plugin"
              },
              {
                "module": "",
                "plugin": "timex.plugin"
              },
              {
                "module": "ipc",
                "plugin": "proc.plugin"
              },
              {
                "module": "/proc/net/sockstat",
                "plugin": "proc.plugin"
              },
              {
                "module": "stats",
                "plugin": "statsd.plugin"
              },
              {
                "module": "dockerd",
                "plugin": "python.d.plugin"
              },
              {
                "module": "stats",
                "plugin": "cgroups.plugin"
              },
              {
                "plugin": "Ti, module:[1]"
              },
              {
                "module": "/proc/interrupts",
                "plugin": "proc.plugin"
              },
              {
                "module": "nv",
                "plugin": "python.d.plugin"
              },
              {
                "module": "/proc/net/snmp",
                "plugin": "proc.plugin"
              },
              {
                "module": "/proc/stat",
                "plugin": "proc.plugin"
              },
              {
                "module": "stats",
                "plugin": "netdata"
              },
              {
                "module": "",
                "plugin": "diskspace.plugin"
              },
              {
                "module": "stats",
                "plugin": "web"
              },
              {
                "module": "sensors",
                "plugin": "python.d.plugin"
              },
              {
                "module": "/proc/net/netstat",
                "plugin": "proc.plugin"
              },
              {
                "module": "/proc/sys/kernel/random/entropy_avail",
                "plugin": "proc.plugin"
              },
              {
                "module": "/proc/vmstat",
                "plugin": "proc.plugin"
              },
              {
                "module": "/proc/net/snmp6",
                "plugin": "proc.plugin"
              },
              {
                "module": "/proc/net/softnet_stat",
                "plugin": "proc.plugin"
              },
              {
                "module": "/proc/net/sockstat6",
                "plugin": "proc.plugin"
              },
              {
                "module": "/sys/fs/cgroup",
                "plugin": "cgroups.plugin"
              },
              {
                "module": "",
                "plugin": "ebpf.plugin"
              }
            ],
            "host_os_id_like": "debian",
            "host_os_version": "20.04.2 LTS (Focal Fossa)",
            "netdata_version": "1.31.0",
            "system_cpu_freq": "3400000000",
            "config_is_parent": false,
            "host_is_k8s_node": "false",
            "system_container": "none",
            "system_cpu_model": "AMD Ryzen 7 1700X Eight-Core Processor",
            "system_total_ram": "16774254592",
            "container_os_name": "none",
            "host_charts_count": 607,
            "host_os_detection": "/etc/os-release",
            "netdata_buildinfo": "dbengine|Native HTTPS|Netdata Cloud|ACLK Next Generation|ACLK Legacy|TLS Host Verification|JSON-C|libcrypto|libm|LWS v3.2.2|mosquitto|zlib|apps|cgroup Network Tracking|EBPF|perf|slabinfo",
            "system_cpu_vendor": "AuthenticAMD",
            "config_memory_mode": "dbengine",
            "config_web_enabled": true,
            "has_alarms_warning": false,
            "host_agent_claimed": false,
            "host_cloud_enabled": true,
            "host_metrics_count": 4824,
            "host_os_version_id": "20.04",
            "system_kernel_name": "Linux",
            "has_alarms_critical": false,
            "host_aclk_available": false,
            "host_dashboard_used": 0,
            "mirrored_host_count": 1,
            "system_architecture": "x86_64",
            "config_https_enabled": true,
            "container_os_id_like": "none",
            "container_os_version": "none",
            "exporting_connectors": "",
            "host_cloud_available": true,
            "netdata_machine_guid": "1db705aa-47ba-11eb-835e-d9622a2f61da",
            "system_cpu_detection": "lscpu",
            "system_ram_detection": "procfs",
            "config_stream_enabled": false,
            "host_collectors_count": 36,
            "system_disk_detection": "sysfs",
            "system_kernel_version": "5.8.0-55-generic",
            "system_virt_detection": "systemd-detect-virt",
            "system_virtualization": "none",
            "config_hosts_available": 1,
            "config_page_cache_size": 32,
            "container_os_detection": "none",
            "netdata_buildinfo_apps": true,
            "netdata_buildinfo_ebpf": true,
            "netdata_buildinfo_libm": true,
            "netdata_buildinfo_perf": true,
            "netdata_buildinfo_zlib": true,
            "system_total_disk_size": "34506759684096",
            "container_os_version_id": "none",
            "netdata_release_channel": "nightly",
            "config_exporting_enabled": false,
            "host_aclk_implementation": "legacy",
            "mirrored_hosts_reachable": 1,
            "netdata_buildinfo_json_c": true,
            "config_multidb_disk_quota": 256,
            "host_allmetrics_json_used": 0,
            "host_collector_module_ipc": true,
            "host_collector_plugin_web": true,
            "host_notification_methods": "",
            "host_allmetrics_shell_used": 0,
            "host_collector_plugin_proc": true,
            "mirrored_hosts_unreachable": 0,
            "netdata_buildinfo_dbengine": true,
            "netdata_buildinfo_slabinfo": true,
            "system_container_detection": "systemd-detect-virt",
            "host_collector_module_stats": true,
            "netdata_buildinfo_libcrypto": true,
            "netdata_buildinfo_mosquitto": true,
            "netdata_buildinfo_lws_v3_2_2": true,
            "system_cpu_logical_cpu_count": "16",
            "host_collector_module_dockerd": true,
            "host_collector_module_systemd": true,
            "host_collector_plugin_netdata": true,
            "netdata_buildinfo_aclk_legacy": true,
            "netdata_buildinfo_native_https": true,
            "host_allmetrics_prometheus_used": 0,
            "host_collector_plugin_tc_plugin": true,
            "netdata_buildinfo_netdata_cloud": true,
            "host_collector_module_proc_uptime": true,
            "host_collector_plugin_apps_plugin": true,
            "host_collector_plugin_ebpf_plugin": true,
            "host_collector_plugin_proc_plugin": true,
            "host_collector_module_proc_loadavg": true,
            "host_collector_module_proc_meminfo": true,
            "host_collector_module_proc_net_dev": true,
            "host_collector_plugin_timex_plugin": true,
            "host_collector_module_proc_pressure": true,
            "host_collector_module_proc_softirqs": true,
            "host_collector_plugin_statsd_plugin": true,
            "host_collector_module_proc_diskstats": true,
            "host_collector_plugin_cgroups_plugin": true,
            "host_collector_plugin_ti,_module:[1]": true,
            "host_collector_plugin_python_d_plugin": true,
            "host_collector_plugin_diskspace_plugin": true,
            "netdata_buildinfo_aclk_next_generation": true,
            "host_collector_module_proc_net_sockstat": true,
            "host_collector_plugin_idlejitter_plugin": true,
            "netdata_buildinfo_tls_host_verification": true,
            "netdata_buildinfo_cgroup_network_tracking": true,
            "host_collector_module_proc_net_stat_nf_conntrack": true
          },
          "distinct_id": "1db705aa-47ba-11eb-835e-d9622a2f61da"
        }
    })
    const eventCopy = await processEvent(clone(event), getMeta())
    expect(eventCopy).toEqual({
        ...event,
        properties: {
            ...event.properties,
            netdata_posthog_plugin_version: netdataPluginVersion,
            interaction_type: 'other',
            interaction_detail: '',
            interaction_token: 'other|',
            event_ph: 'test event',
            distinct_id_is_empty: false
        },
    })
})
