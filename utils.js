export function cleanPropertyName(k) {
    return k
        // convert to lower case
        .toLowerCase()
        // remove leading slash
        .replace(/^\//, "")
        // replace all slashes and dots with _
        .replace(/\/|\.|-| /g, "_")
        ;
}

export function isStringDDMMYYYYHHMM(dt){
    var reDate = /^((0?[1-9]|[12][0-9]|3[01])[- /.](0?[1-9]|1[012])[- /.](19|20)?[0-9]{2}[ ][012][0-9][:][0-9]{2})*$/;
    return reDate.test(dt);
}