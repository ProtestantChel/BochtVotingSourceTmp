namespace ReactApp4.Server.Models
{
    public class SeatInfo
    {
        public Guid assignedParticipantId { get; set; }
        public bool canPrio { get; set; }
        public bool canVote { get; set; }
        public string hideSeat { get; set; }
        public string screenLine { get; set; }
        public Guid seatId { get; set; }
        public string seatName { get; set; }
        public string seatType { get; set; }
        public Guid seatedParticipantId { get; set; }
        public string status { get; set; }
        public string visType { get; set; }
    }
}
