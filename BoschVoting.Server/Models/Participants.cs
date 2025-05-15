namespace ReactApp4.Server.Models
{
    public class Participants
    {
       public bool isPresent {  get; set; }
       public bool canPrio { get; set; }
       public bool canVote { get; set; }
       public string country { get; set; }
       public string email { get; set; }
       public string firstName { get; set; }
       public string group { get; set; }
       public bool isAuthenticated { get; set; }
       public string lastName { get; set; }
       public string middleName { get; set; }
       public string participantId { get; set; }
       public string personId { get; set; }
       public int pictureUpdatedNumber { get; set; }
       public string region { get; set; }
       public string title { get; set; }
       public int voteWeight { get; set; }
    }
}
