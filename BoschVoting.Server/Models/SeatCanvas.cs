namespace ReactApp4.Server.Models
{
    public class SeatCanvas
    {
        public Guid id { get; set; }
        public float left { get; set; }
        public string seatedParticipantId { get; set; }
        public string text { get; set; }
        public float top { get; set; }
        public int isMute { get; set; }
    }
}
