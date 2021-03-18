async function setupPlugin({ config, global }) {
    console.log("Setting up the plugin!")
    console.log(config)
    global.setupDone = true
}

function cleanPropertyName(k) {
    return k
        // convert to lower case
        .toLowerCase()
        // remove leading slash
        .replace(/^\//, "")
        // replace all slashes and dots with _
        .replace(/\/|\.|-| /g, "_")
        ;
}

async function processEvent(event, { config, cache }) {

    if (event.properties) {
        
        // check if netdata_version property exists
        if (event.properties['netdata_version']) {
            // flag if a nightly version
            event.properties['netdata_nightly'] = !!event.properties['netdata_version'].includes('nightly');
        }

        // has_alarms_critical
        if (typeof event.properties['alarms_critical'] === 'number') {
            event.properties['has_alarms_critical'] = event.properties['alarms_critical'] > 0
        }

        // has_alarms_warning
        if (typeof event.properties['alarms_warning'] === 'number') {
            event.properties['has_alarms_warning'] = event.properties['alarms_warning'] > 0
        }

        // add attribute for each build info flag
        if (event.properties['netdata_buildinfo']) {
            [...new Set(event.properties['netdata_buildinfo'].split('|'))].forEach((buildInfo) => {
                if (!(buildInfo === "")){
                    event.properties[`netdata_buildinfo_${cleanPropertyName(buildInfo)}`] = true
                }
            })
        }

        // add attribute for each host collector
        if (event.properties['host_collectors']) {

            // make set for both plugins and modules present
            let plugins = [...new Set(event.properties['host_collectors'].map(a => a.plugin))];
            let modules = [...new Set(event.properties['host_collectors'].map(a => a.module))];

            // add flag for each plugin
            plugins.forEach((plugin) => {
                if ((plugin !== "") && (plugin !== null)){
                    event.properties[`host_collector_plugin_${cleanPropertyName(plugin)}`] = true
                }
            })

            // add flag for each module
            modules.forEach((module) => {
                if (!(module === "")){
                    event.properties[`host_collector_module_${cleanPropertyName(module)}`] = true
                }
            })
        }

        // check if netdata_machine_guid property exists
        if (typeof event.properties['netdata_machine_guid'] === 'string') {
            // flag if empty string
            if (event.properties['netdata_machine_guid']==='') {
                event.properties['netdata_machine_guid'] = 'empty'
                event.properties['netdata_machine_guid_is_empty'] = true
            } else {
                event.properties['netdata_machine_guid_is_empty'] = false
            }
        }

        // check if netdata_machine_guid property exists
        if (typeof event.properties['netdata_person_id'] === 'string') {
            // flag if empty string
            if (event.properties['netdata_person_id']==='') {
                event.properties['netdata_person_id'] = 'empty'
                event.properties['netdata_person_id_is_empty'] = true
            } else {
                event.properties['netdata_person_id_is_empty'] = false
            }
        }

        // check if $distinct_id property exists
        if (typeof event.properties['distinct_id'] === 'string') {
            // flag if empty string
            if (event.properties['distinct_id']==='') {
                event.properties['distinct_id'] = 'empty'
                event.properties['distinct_id_is_empty'] = true
            } else {
                event.properties['distinct_id_is_empty'] = false
            }
        }

        if (event.properties['$elements']) {

            event.properties['$elements'].forEach((element) => {

                // data_testid
                if ('attr__data-testid' in element) {
                    arr = element['attr__data-testid'].split('::')
                    event.properties['el_data_testid'] = element['attr__data-testid']
                    event.properties['el_data_testid_0'] = arr[0]
                    event.properties['el_data_testid_1'] = arr[1]
                    event.properties['el_data_testid_2'] = arr[2]
                    event.properties['el_data_testid_3'] = arr[3]
                    event.properties['el_data_testid_4'] = arr[4]
                }

                // href_menu
                if ('attr__href' in element) {
                    if ((element['attr__href'] !== null) && (element['attr__href'].substring(0,5) === '#menu')) {
                        event.properties['el_href_menu'] = element['attr__href']
                    }
                }

                // el_text
                if ('$el_text' in element) {
                    if (element['$el_text'] !== null) {
                        event.properties['el_text'] = element['$el_text']
                    }
                }

                // el_data_netdata
                if ('attr__data-netdata' in element) {
                    if (element['attr__data-netdata'] !== null) {
                        event.properties['el_data_netdata'] = element['attr__data-netdata']
                    }
                }

            })

        }

        // interaction_type
        if (event === '$pageview') {
            event.properties['interaction_type'] = 'pageview'
        } else if (event === '$pageleave') {
            event.properties['interaction_type'] = 'pageleave'
        } else if ('el_href_menu' in event.properties) {
            if (event.properties['el_href_menu'].includes('submenu')) {
                event.properties['interaction_type'] = 'submenu'
            } else {
                event.properties['interaction_type'] = 'menu'
            }
        } else {
            event.properties['interaction_type'] = 'other'
        }

        event.properties['netdata_posthog_plugin_version'] = '0.0.1'
   
    }

    return event
}

module.exports = {
    setupPlugin,
    processEvent,
}
