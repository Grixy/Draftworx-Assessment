namespace Draftworx_Assessment_API.Models
{

  // I'm not a fan of camelcasing class properties, but my formatter on VS is constantly converting to camelCase instead of keeping PascalCase even when I'm referencing properties.
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
