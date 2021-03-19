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

        // extract properties from elements
        if (event.properties['$elements']) {

            // process each element
            event.properties['$elements'].forEach((element) => {

                // el_data_testid
                if ('attr__data-testid' in element) {
                    arr = element['attr__data-testid'].split('::')
                    event.properties['el_data_testid'] = element['attr__data-testid']
                    event.properties['el_data_testid_0'] = arr[0]
                    event.properties['el_data_testid_1'] = arr[1]
                    event.properties['el_data_testid_2'] = arr[2]
                    event.properties['el_data_testid_3'] = arr[3]
                    event.properties['el_data_testid_4'] = arr[4]
                }

                // el_href_menu
                if ('attr__href' in element && element['attr__href'] !== null && element['attr__href'].substring(0,5) === '#menu') {
                        event.properties['el_href_menu'] = element['attr__href']
                }

                // el_href
                if ('attr__href' in element && element['attr__href'] !== null) {
                    event.properties['el_href'] = element['attr__href']
                }

                // el_onclick
                if ('attr__onclick' in element && element['attr__onclick'] !== null) {
                    event.properties['el_onclick'] = element['attr__onclick']
                }

                // el_id
                if ('attr__id' in element && element['attr__id'] !== null) {
                    event.properties['el_id'] = element['attr__id']
                }

                // el_title
                if ('attr__title' in element && element['attr__title'] !== null) {
                    event.properties['el_title'] = element['attr__title']
                }

                // el_text
                if ('$el_text' in element && element['$el_text'] !== null) {
                    event.properties['el_text'] = element['$el_text']
                }

                // el_data_netdata
                if ('attr__data-netdata' in element && element['attr__data-netdata'] !== null) {
                    event.properties['el_data_netdata'] = element['attr__data-netdata']
                }

                // el_data_target
                if ('attr__data-target' in element && element['attr__data-target'] !== null) {
                    event.properties['el_data_target'] = element['attr__data-target']
                }

                // el_data_id
                if ('attr__data-id' in element && element['attr__data-id'] !== null) {
                    event.properties['el_data_id'] = element['attr__data-id']
                }

                // el_data_original_title
                if ('attr__data-original-title' in element && element['attr__data-original-title'] !== null) {
                    event.properties['el_data_original_title'] = element['attr__data-original-title']
                }

                // el_data_toggle
                if ('attr__data-toggle' in element && element['attr__data-toggle'] !== null) {
                    event.properties['el_data_toggle'] = element['attr__data-toggle']
                }

                // el_data-legend-position
                if ('attr__data-legend-position' in element && element['attr__data-legend-position'] !== null) {
                    event.properties['el_data_legend_position'] = element['attr__data-legend-position']
                }

                // el_class_netdata_legend_toolbox
                if ('attr__class' in element && element['attr__class'] !== null && element['attr__class'] === 'netdata-legend-toolbox') {
                    event.properties['el_class_netdata_legend_toolbox'] = true
                }

                // el_class_fa_play
                if ('attr__class' in element && element['attr__class'] !== null && element['attr__class'].includes('fa-play')) {
                    event.properties['el_class_fa_play'] = true
                }

                // el_class_fa_play
                if ('attr__class' in element && element['attr__class'] !== null && element['attr__class'].includes('fa-play')) {
                    event.properties['el_class_fa_play'] = true
                }

                // el_class_navbar_highlight_content
                if ('attr__class' in element && element['attr__class'] !== null && element['attr__class'].includes('navbar-highlight-content')) {
                    event.properties['el_class_navbar_highlight_content'] = true
                }

                // el_class_datepickercontainer
                if ('attr__class' in element && element['attr__class'] !== null && element['attr__class'].includes('DatePickerContainer')) {
                    event.properties['el_class_datepickercontainer'] = true
                }

            })

        }

        // interaction_type
        if (event.event === '$pageview') {
            event.properties['interaction_type'] = 'pageview'
        } else if (event.event === '$pageleave') {
            event.properties['interaction_type'] = 'pageleave'
        } else if ('el_href_menu' in event.properties) {
            if (event.properties['el_href_menu'].includes('submenu')) {
                event.properties['interaction_type'] = 'submenu'
            } else {
                event.properties['interaction_type'] = 'menu'
            }
        } else if ('el_data_netdata' in event.properties) {
            event.properties['interaction_type'] = 'chart_dim'
        } else if ('el_title' in event.properties) {
            if (event.properties['el_title'] === 'Settings') {
                event.properties['interaction_type'] = 'settings'
            }
        } else if (event.properties['event_source'] === 'agent backend' ) {
            event.properties['interaction_type'] = 'agent_backend'
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
