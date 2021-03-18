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
   
    }

    // extract useful properties from autocapture elements
    if (event.elements) {

        // loop over each element
        event.elements.forEach((element) => {

            // if attributes present
            if (element.attributes) {

                // extract data-testid if present
                if (element.attributes['attr__data-testid']) {
                    event.properties['data_testid'] = element.attributes['attr__data-testid']
                }

            }
        })
    }

    return event
}

module.exports = {
    setupPlugin,
    processEvent,
}
