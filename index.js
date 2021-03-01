async function setupPlugin({ config, global }) {
    console.log("Setting up the plugin!")
    console.log(config)
    global.setupDone = true
}

async function processEvent(event, { config, cache }) {
    const counter = await cache.get('counter', 0)
    cache.set('counter', counter + 1)

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
        
    }

    return event
}

module.exports = {
    setupPlugin,
    processEvent,
}
