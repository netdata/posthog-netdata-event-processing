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

        event = processElements(event)
        event = processProperties(event)

    }

    return event
}

module.exports = {
    setupPlugin,
    processEvent,
}
