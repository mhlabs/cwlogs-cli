const AWS = require("aws-sdk");

function getUrl(query, source) {
    return `https://${AWS.config.region}.console.aws.amazon.com/cloudwatch/home?region=${AWS.config.region}#logsV2:logs-insights$3FqueryDetail$3D$257E$2528end$257E0$257Estart$257E-3600$257EtimeType$257E$2527RELATIVE$257Eunit$257E$2527seconds$257EeditorString$257E$2527${query}$257EisLiveTail$257Efalse$257Esource$257E$2528${source}$2529$2529`
}

module.exports = {
    getUrl
}