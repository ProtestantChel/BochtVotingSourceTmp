
export function isEmptyObject(obj) {
    for (const prop in obj) {
        if (Object.hasOwn(obj, prop)) {
            return false;
        }
    }
    return true;
}


function isUndefined(obj) {
    return typeof obj === 'undefined';
}

function isNull(obj) {
    return typeof obj === null;
}

function isNotEmpty(obj) {
    return (typeof obj !== 'undefined' && obj !== null && obj !== '');
}
function isObject(value) {
    return value !== null && typeof value === 'object';
}
function isString(value) {return typeof value === 'string';}

function fromJson(json) {
    return isString(json)
        ? JSON.parse(json)
        : json;
}

function isArray(arr) {
    return Array.isArray(arr) || arr instanceof Array;
}
export function sendEvent(array) {
    if (isArray(array)) {
        if (array.includes("SeatsChanged")) {
            return [{
                messageId: 0,
                operation: "getSeats",
                parameters: {}
            }, {
                    messageId: 0,
                    operation: "getParticipantSeats",
                    parameters: {}
                }];
        }
        if (array.includes("PresentationStateChanged")) {
            return [{
                messageId: 0,
                operation: "getParticipantSeats",
                parameters: {}
            }, {
                    messageId: 0,
                    operation: "getSeats",
                    parameters: {}
                },
                {
                    messageId: 0,
                    operation: "getSeatVotingResults",
                    parameters: {}
                }
            ];
        }
        if (array.includes("ParticipantsChanged")) {
            return [{
                messageId: 0,
                operation: "getParticipantSeats",
                parameters: {}
            },
            {
                messageId: 0,
                operation: "getParticipants",
                parameters: {}
            }
            ];
        }
        if (array.includes("VotingStateChanged")) {
            return [{
                messageId: 0,
                operation: "getVotingState",
                parameters: {}
            },
            {
                messageId: 0,
                operation: "getParticipantSeats",
                parameters: {}
            },
            {
                messageId: 0,
                operation: "getVotingInfo",
                parameters: {}
            }
            ];
        }
        if (array.includes("VotingInfoChanged")) {
            return [{
                messageId: 0,
                operation: "getVotingInfo",
                parameters: {}
            }, {
                    messageId: 0,
                    operation: "getParticipantSeats",
                    parameters: {}
                }
            ];
        }
        if (array.includes("VotingResultChanged")) {
            return [{
                    messageId: 0,
                    operation: "getVotingResults",
                    parameters: {}
                }, {
                    messageId: 0,
                    operation: "getSeatVotingResults",
                    parameters: {}
                }, {
                    messageId: 0,
                    operation: "getParticipantSeats",
                    parameters: {}
                }, {
                    messageId: 0,
                    operation: "getParticipants",
                    parameters: {}
                }
            ];
        }
        if (array.includes("QuorumResultChanged")) {
            return [{
                messageId: 0,
                operation: "getQuorumResult",
                parameters: {}
            }]
        }
        if (array.includes("DiscussionListChanged")) {
            return [{
                messageId: 0,
                operation: "getDiscussionList",
                parameters: {}
            }]
        }

        return []
    }
}