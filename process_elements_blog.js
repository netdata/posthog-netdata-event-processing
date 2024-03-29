
export function processElementsBlog(event) {
    // extract properties from elements
    if (event.properties['$elements']) {

        // process each element, reverse to use posthog order as preference
        event.properties['$elements'].slice().reverse().forEach((element) => {

            // el_data_testid
            if ('attr__data-testid' in element) {
                event.properties['el_data_testid'] = element['attr__data-testid']

                // el_data_testid_0
                if (element['attr__data-testid'].includes('::')) {
                    arr = element['attr__data-testid'].split('::')
                    event.properties['el_data_testid_0'] = arr[0]
                    event.properties['el_data_testid_1'] = arr[1]
                    event.properties['el_data_testid_2'] = arr[2]
                    event.properties['el_data_testid_3'] = arr[3]
                    event.properties['el_data_testid_4'] = arr[4]
                }

            }

            // el_data_ga
            if ('attr__data-ga' in element) {
                event.properties['el_data_ga'] = element['attr__data-ga']

                // el_data_ga_0
                if (element['attr__data-ga'].includes('::')) {
                    arr = element['attr__data-ga'].split('::')
                    event.properties['el_data_ga_0'] = arr[0]
                    event.properties['el_data_ga_1'] = arr[1]
                    event.properties['el_data_ga_2'] = arr[2]
                    event.properties['el_data_ga_3'] = arr[3]
                    event.properties['el_data_ga_4'] = arr[4]
                }

            }

            // el_data_track
            if ('attr__data-track' in element) {
                event.properties['el_data_track'] = element['attr__data-track']

                // el_data_track_0
                if (element['attr__data-track'].includes('::')) {
                    arr = element['attr__data-track'].split('::')
                    event.properties['el_data_track_0'] = arr[0]
                    event.properties['el_data_track_1'] = arr[1]
                    event.properties['el_data_track_2'] = arr[2]
                    event.properties['el_data_track_3'] = arr[3]
                    event.properties['el_data_track_4'] = arr[4]
                }

            }

            // el_href
            if ('attr__href' in element && element['attr__href'] !== null) {
                event.properties['el_href'] = element['attr__href']
            } else if ('href' in element && element['href'] !== null) {
                event.properties['el_href'] = element['href']
            } else if ('$href' in element && element['$href'] !== null) {
                event.properties['el_href'] = element['$href']
            }

            // el_onclick
            if ('attr__onclick' in element && element['attr__onclick'] !== null) {
                event.properties['el_onclick'] = element['attr__onclick']
            }

            // el_id
            if ('attr__id' in element && element['attr__id'] !== null) {
                event.properties['el_id'] = element['attr__id']
            }

            // el_name
            if ('attr__name' in element && element['attr__name'] !== null) {
                event.properties['el_name'] = element['attr__name']
            }

            // el_title
            if ('attr__title' in element && element['attr__title'] !== null) {
                event.properties['el_title'] = element['attr__title']
            }

            // el_text
            if ('$el_text' in element && element['$el_text'] !== null && element['$el_text'] !== '') {
                event.properties['el_text'] = element['$el_text']

            } else if ('text' in element && element['text'] !== null && element['text'] !== '') {
                event.properties['el_text'] = element['text']
            }

            // el_class
            if ('attr__class' in element && element['attr__class'] !== null) {
                event.properties['el_class'] = element['attr__class']
            }

            // el_aria_label
            if ('attributes' in element && element['attributes'] !== null && 'attr__aria-label' in element['attributes']) {
                event.properties['el_aria_label'] = element['attributes']['attr__aria-label']
            }

        })

    }

    return event
}
