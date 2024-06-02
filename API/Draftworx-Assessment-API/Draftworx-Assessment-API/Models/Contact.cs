namespace Draftworx_Assessment_API.Models
{
  public class Contact
  {
    public int Id { get; set; }
    public string ContactName { get; set; }
    public string PhoneNumber { get; set; }
    public string BestTimeToContact { get; set; }
    public string ReasonForCall { get; set; }
    public List<string> Notes { get; set; }
  }
}
