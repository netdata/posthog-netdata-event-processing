import {cleanPropertyName} from "./utils";

export function processPropertiesCloud(event) {

    // break out $pathname
    if (event.properties['$pathname']) {
        let idx = 1;
        [...new Set(event.properties['$pathname'].split('/'))].forEach((pathName) => {
            if ((pathName !== "") && (pathName !== null)){
                event.properties[`pathname_${idx}`] = pathName
                idx = ++idx
            }
        })
    }

    return event
}