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

        // add attribute for each collector being used
        if (event.properties['host_collector_modules']) {
            event.properties['host_collector_modules'].split('|').forEach((collector) => {
                if (!(collector === "")){
                    const collectorKey = collector
                        // remove leading slash
                        .replace(/^\//, "")
                        // replace all slashes and dots with _
                        .replace(/\/|\./g, "_")
                    event.properties[`host_collector_${collectorKey}`] = true
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
