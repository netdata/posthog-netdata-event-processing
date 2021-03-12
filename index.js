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
                if (!(plugin === "")){
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

    return event
}

module.exports = {
    setupPlugin,
    processEvent,
}
