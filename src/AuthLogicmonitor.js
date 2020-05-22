import hmacSHA256 from 'crypto-js/hmac-sha256'
// import base64 from 'crypto-js/enc-base64'
import { Buffer } from 'buffer/'

@registerDynamicValueClass
class AuthLogicMonitor {
    static identifier = 'ch.nexellent.AuthLogicMonitor'
    static title = 'LMv1 Auth'
    static help = 'https://luckymarmot.com/paw/doc/'
    static inputs = [
        InputField("baseurl", "Instance URL", "String", {
            persisted: true,
            defaultValue: "https://<account>.logicmonitor.com",
            placeholder: "Base URL of your instance (e.g. https://api.logicmonitor.com)"
        }),
        InputField("baseuri", "REST API endpoint", "String", {
            persisted: false,
            defaultValue: "/santaba/rest",
            placeholder: "Base URI of the REST API endpoint"
        }),
        InputField("api_id", "Access ID", "String", {
            persisted: true,
            defaultValue: "",
            placeholder: "Enter your API ID"
        }),
        InputField("api_key", "Access Key", "String", {
            persisted: true,
            defaultValue: "",
            placeholder: "Enter your API key"
        }),
    ]

    title() {
        return 'LMv1 Auth'
    }

    evaluate(Context) {
        if (Context.runtimeInfo.task != 'requestSend') {
            return '** LMv1 authentication signature is only generated during request send **'
        }

        var request = Context.getCurrentRequest();
        var epoch = (new Date()).getTime()
        var http_verb = request.method;

        var escBaseUrl = this.baseurl.replace(/\//g, '\\/').replace(/\./g, '\\.')
        var escBaseUri = this.baseuri.replace(/\//g, '\\/')
        var escUrl = escBaseUrl + escBaseUri
        var pattern = "(^" + escUrl + ")([^\\?]+)(\\?.*)?"
        var regexp = new RegExp(pattern)

        var resource_path = request.urlBase.replace(regexp, '$2')

        var request_vars = (http_verb == 'GET' || http_verb == 'DELETE') ?
            http_verb + epoch + resource_path :
            http_verb + epoch + request.body + resource_path;

        console.log("request_vars: " + request_vars)

        // var signature = base64.stringify(hmacSHA256(request_vars, this.api_key))
        var signature = Buffer.from(hmacSHA256(request_vars, this.api_key).toString()).toString('base64')

        var authHeader = "LMv1 " + this.api_id + ":" + signature + ":" + epoch
        console.log("authHeader: " + authHeader)
        return authHeader
    }
}