async function setupPlugin({ config, global }) {
    console.log("Setting up the plugin!")
    console.log(config)
    global.setupDone = true
}

async function processEvent(event, { config, cache }) {

    const mobileOS = ["Android", "iOS"]
    const desktopOS = ["Windows", "Mac OS X", "Linux"]
    const flagCollectorModules = ["redis"]

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

        // add attributes to see if specific collectors being used
        if (event.properties['host_collector_modules']) {
            event.properties['host_collector_redis'] = !!event.properties['host_collector_modules'].includes('redis');
            event.properties['host_collector_web_log'] = !!event.properties['host_collector_modules'].includes('web_log');
            event.properties['host_collector_proc_diskstats'] = !!event.properties['host_collector_modules'].includes('/proc/diskstats');
        }
   
    }

    return event
}

module.exports = {
    setupPlugin,
    processEvent,
}
