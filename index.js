async function setupPlugin({ config, global }) {
    console.log("Setting up the plugin!")
    console.log(config)
    global.setupDone = true
}

async function processEvent(event, { config, cache }) {

    var mobileOS = ["Android", "iOS"]
    var desktopOS = ["Windows", "Mac OS X", "Linux"]

    if (event.properties) {
        
        // check if netdata_version property exists
        if (event.properties['netdata_version']) {
            // flag if a nightly version
            if (event.properties['netdata_version'].includes('nightly')) {
                event.properties['netdata_nightly'] = true
            }
            else {
                event.properties['netdata_nightly'] = false
            }
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
   
    }

    return event
}

module.exports = {
    setupPlugin,
    processEvent,
}
