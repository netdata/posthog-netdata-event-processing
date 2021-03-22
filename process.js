import { getInteractionType } from './interaction_type';
import { getInteractionDetail } from './interaction_detail';
import { processElements } from './process_elements';
import { processProperties } from './process_properties';

async function setupPlugin({ config, global }) {
    console.log("Setting up the plugin!")
    console.log(config)
    global.setupDone = true
}

async function processEvent(event, { config, cache }) {

    if (event.properties) {

        event.properties['event_ph'] = event.event

        event = processProperties(event)
        event = processElements(event)
        event.properties['interaction_type'] = getInteractionType(event)
        event.properties['interaction_detail'] = getInteractionDetail(event)
        event.properties['interaction_token'] = event.properties['interaction_type'].concat('|',event.properties['interaction_detail'])
        event.properties['netdata_posthog_plugin_version'] = '0.0.1'
        if (event.event === '$autocapture' && event.properties.hasOwnProperty('interaction_token')) {
            event.event = event.properties['interaction_token']
        }

    }

    return event
}

module.exports = {
    setupPlugin,
    processEvent,
}
