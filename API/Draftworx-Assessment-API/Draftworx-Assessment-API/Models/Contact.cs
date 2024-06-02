namespace Draftworx_Assessment_API.Models
{
  public class Contact
  {
    public int id { get; set; }
    public string contactName { get; set; }
    public string phoneNumber { get; set; }
    public string? bestTimeToContact { get; set; }
    public string? reasonForCall { get; set; }
    public List<string>? notes { get; set; }
  }
}
