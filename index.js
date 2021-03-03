async function setupPlugin({ config, global }) {
    console.log("Setting up the plugin!")
    console.log(config)
    global.setupDone = true
}

async function processEvent(event, { config, cache }) {

    const mobileOS = ["Android", "iOS"]
    const desktopOS = ["Windows", "Mac OS X", "Linux"]

    if (event.properties) {
        
        // check if netdata_version property exists
        if (event.properties['netdata_version']) {
            // flag if a nightly version
            event.properties['netdata_nightly'] = !!event.properties['netdata_version'].includes('nightly');
        }

        // derive device_type
        if (event.properties['$os']) {
            if (mobileOS.includes(event.properties['$os'])) {
                event.properties['device_type'] = 'Mobile'
            }
            else if (desktopOS.includes(event.properties['$os'])) {
                event.properties['device_type'] = 'Desktop'
            } else {
                event.properties['device_type'] = 'Other'
            }
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

        // add attribute for each plugin being used
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
   
    }

    return event
}

module.exports = {
    setupPlugin,
    processEvent,
}
