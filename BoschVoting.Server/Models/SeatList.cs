using System;

namespace ReactApp4.Server.Models
{
    public class SeatList
    {
        public string assignedParticipantId { get; set; }
        public bool canPrio { get; set; }
        public bool canVote { get; set; }
        public bool hideSeat { get; set; }
        public string screenLine { get; set; }
        public Guid seatId { get; set; }
        public string seatName { get; set; }
        public string seatType { get; set; }
        public string seatedParticipantId { get; set; }
        public string status { get; set; }
        public string visType { get; set; }
    }
}
