using Draftworx_Assessment_API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace Draftworx_Assessment_API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class ContactsController : ControllerBase
  {
    private static List<Contact> Contacts;
    private static int NextId;

    static ContactsController()
    {
      // Initialize the contacts list with three initial contacts. Naturally we'd rather be using a db for this, but this is a POC by design.
      Contacts = new List<Contact>
            {
                new Contact
                {
                    Id = 1,
                    ContactName = "John Doe",
                    PhoneNumber = "123-456-7890",
                    BestTimeToContact = "Morning",
                    ReasonForCall = "Inquiry",
                    Notes = new List<string> { "First note", "Second note" }
                },
                new Contact
                {
                    Id = 2,
                    ContactName = "Jane Smith",
                    PhoneNumber = "987-654-3210",
                    BestTimeToContact = "Afternoon",
                    ReasonForCall = "Support",
                    Notes = new List<string> { "Initial note" }
                },
                new Contact
                {
                    Id = 3,
                    ContactName = "Alice Johnson",
                    PhoneNumber = "082-123-4567",
                    BestTimeToContact = "Evening",
                    ReasonForCall = "Follow-up",
                    Notes = new List<string> { "First contact note" }
                }
            };
      NextId = 4; // Set the next ID to 4 since we have 3 initial contacts
    }

    [HttpGet("GetContacts")]
    public JsonResult GetContacts()
    {
      return new JsonResult(Contacts);
    }

    [HttpPost("CreateContact")]
    public JsonResult CreateContact([FromBody] Contact newContact)
    {
      newContact.Id = NextId++;
      Contacts.Add(newContact);
      return new JsonResult(newContact);
    }

    [HttpGet("GetContact/{id}")]
    public JsonResult GetContact(int id)
    {
      var contact = Contacts.FirstOrDefault(c => c.Id == id);
      if (contact == null)
      {
        return new JsonResult("Contact not found") { StatusCode = StatusCodes.Status404NotFound };
      }
      return new JsonResult(contact);
    }

    [HttpPut("UpdateContact/{id}")]
    public JsonResult UpdateContact(int id, [FromBody] Contact updatedContact)
    {
      var contact = Contacts.FirstOrDefault(c => c.Id == id);
      if (contact == null)
      {
        return new JsonResult("Contact not found") { StatusCode = StatusCodes.Status404NotFound };
      }
      contact.ContactName = updatedContact.ContactName;
      contact.PhoneNumber = updatedContact.PhoneNumber;
      contact.BestTimeToContact = updatedContact.BestTimeToContact;
      contact.ReasonForCall = updatedContact.ReasonForCall;
      contact.Notes = updatedContact.Notes;
      return new JsonResult(contact);
    }

    [HttpDelete("DeleteContact/{id}")]
    public JsonResult DeleteContact(int id)
    {
      var contact = Contacts.FirstOrDefault(c => c.Id == id);
      if (contact == null)
      {
        return new JsonResult("Contact not found") { StatusCode = StatusCodes.Status404NotFound };
      }
      Contacts.Remove(contact);
      return new JsonResult("Contact deleted");
    }
  }
}
