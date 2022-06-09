import {cleanPropertyName} from "./utils";

export function processPropertiesWebsite(event) {

    // break out $pathname
    if (event.properties['$pathname']) {
        [...new Set(event.properties['$pathname'].split('/'))].forEach((pathName) => {
            if ((pathName !== "") && (pathName !== null)){
                event.properties[`pathname_${pathName.index}`] = pathName
            }
        })
    }

    return event
}