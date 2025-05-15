import { sendEvent } from "./helpers";

export default class WebSocketConnectTest {

    constructor() {
        const WS_URL = "wss://hpz2g9-conferenc:31416/Dicentis/API"



        this.ws = new WebSocket(WS_URL, 'DICENTIS_1_0');
        this.message = {}
        this.ws.onopen = () => {
            console.log("WebSocket Connected");
            this.send({
                messageId: this.increment,
                operation: "getApiState",
                parameters: {}
            })
        }
        this.ws.onmessage = (e) => {
            let request = JSON.parse(e.data)
            this.message = request
            if (JSON.stringify(e.data).indexOf("getApiState") !== -1 && request.parameters.online) {
                this.send({
                    messageId: this.increment,
                    operation: "login",
                    parameters: {
                        password: "",
                        user: "Admin"
                    }
                });
            } else {
                if (JSON.stringify(e.data).indexOf("getApiState") !== -1 && !request.parameters.online){
                    this.send({
                        messageId: this.increment,
                        operation: "getApiState",
                        parameters: {}
                    })
                }

            }
            if (request.parameters?.loggedIn) {
                this.send({
                    messageId: 4,
                    operation: "registerEvents",
                    parameters: {
                        "events": [
                            "PermissionsChanged",
                            "ApiStateChanged",
                            "SeatsChanged",
                            "DiscussionListChanged",
                            "MeetingInfoChanged",
                            "IndividualVotingResultsChanged",
                            "VotingStateChanged",
                            "EnableSeatIlluminationChanged",
                            "IlluminatedSeatChanged",
                            "SystemPowerModeChanged",
                            "AgendaTopicsChanged",
                            "ParticipantsChanged",
                            "VotingScriptChanged",
                            "VotingResultChanged",
                            "InterpretationLanguagesChanged",
                            "InterpretationRoutingsChanged",
                            "InterpreterSeatsChanged",
                            "InterpreterBoothsChanged",
                            "BoothNotificationsChanged",
                            "MasterVolumeChanged",
                            "MasterVolumeRangeChanged",
                            "PresentationStateChanged",
                            "FileChanged",
                            "ParticipantSeatsChanged",
                            "QuorumResultChanged",
                            "MajorityResultChanged",
                            "VotingInfoChanged",
                            "NotesFileListChanged",
                            "InterpretationMetaRequestStatusChanged",
                            "RoomNameChanged",
                            "RoomContactEmailChanged",
                            "PluginsChanged",
                            "PluginEventAvailable",
                            "PluginCommandAvailable",
                            "ParticipantAccessDenied"
                        ]
                    }
                })
            }
            if (request.operation === "event") {
                sendEvent(request.parameters.events).forEach((t) => {
                    this.send(t)
                })
            }
        }
        this.increment = 0
    }
    send(msg) {
        let interval = setInterval(() => {
            if (this.ws.readyState === WebSocket.OPEN) {
                msg.messageId = this.increment
                this.ws.send(JSON.stringify(msg));
                this.increment = this.increment + 1;
                clearInterval(interval)
            }
        }, 1000)
        setTimeout(() => {clearInterval(interval)}, 15000)
        this.increment = this.increment + 1;

    }
    count() {
        this.increment = this.increment + 1;
    }
    get message(){
        return this._message
    }
    set message(message){
        this._message = message
    }
    get ws(){
        return this._ws
    }
    set ws(ws){
        this._ws = ws
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}

