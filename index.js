async function setupPlugin({ config, global }) {
    console.log("Setting up the plugin!")
    console.log(config)
    global.setupDone = true
}

async function processEvent(event, { config, cache }) {

    if (event.properties) {
        
        // check if netdata_version property exists
        if (event.properties['netdata_version']) {
            // flag if a nightly version
            event.properties['netdata_nightly'] = !!event.properties['netdata_version'].includes('nightly');
        }

        // add attribute for each collector module being used
        if (event.properties['host_collector_modules']) {
            [...new Set(event.properties['host_collector_modules'].split('|'))].forEach((module) => {
                if (!(module === "")){
                    const moduleKey = module
                        // remove leading slash
                        .replace(/^\//, "")
                        // replace all slashes and dots with _
                        .replace(/\/|\./g, "_")
                    event.properties[`host_collector_module_${moduleKey}`] = true
                }
            })
        }

        // add attribute for each collector plugin being used
        if (event.properties['host_collector_plugins']) {
            [...new Set(event.properties['host_collector_plugins'].split('|'))].forEach((plugin) => {
                if (!(plugin === "")){
                    const pluginKey = plugin
                        // remove leading slash
                        .replace(/^\//, "")
                        // replace all slashes and dots with _
                        .replace(/\/|\./g, "_")
                    event.properties[`host_collector_plugin_${pluginKey}`] = true
                }
            })
        }

        // has_alarms_critical
        if (event.properties['alarms_critical']) {
            event.properties['has_alarms_critical'] = event.properties['alarms_critical'] > 0
        }

        // has_alarms_warning
        if (event.properties['alarms_warning']) {
            event.properties['has_alarms_warning'] = event.properties['alarms_warning'] > 0
        }
   
    }

    return event
}

module.exports = {
    setupPlugin,
    processEvent,
}
