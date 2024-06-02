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
                    id = 1,
                    contactName = "John Doe",
                    phoneNumber = "123-456-7890",
                    bestTimeToContact = "Morning",
                    reasonForCall = "Inquiry",
                    notes = new List<string> { "First note", "Second note" }
                },
                new Contact
                {
                    id = 2,
                    contactName = "Jane Smith",
                    phoneNumber = "987-654-3210",
                    bestTimeToContact = "Afternoon",
                    reasonForCall = "Support",
                    notes = new List<string> { "Initial note" }
                },
                new Contact
                {
                    id = 3,
                    contactName = "Alice Johnson",
                    phoneNumber = "082-123-4567",
                    bestTimeToContact = "Evening",
                    reasonForCall = "Follow-up",
                    notes = new List<string> { "First contact note" }
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
      newContact.id = NextId++;
      Contacts.Add(newContact);
      return new JsonResult(newContact);
    }

    [HttpGet("GetContact/{id}")]
    public JsonResult GetContact(int id)
    {
      var contact = Contacts.FirstOrDefault(c => c.id == id);
      if (contact == null)
      {
        return new JsonResult("Contact not found") { StatusCode = StatusCodes.Status404NotFound };
      }
      return new JsonResult(contact);
    }

    [HttpPut("UpdateContact/{id}")]
    public JsonResult UpdateContact(int id, [FromBody] Contact updatedContact)
    {
      var contact = Contacts.FirstOrDefault(c => c.id == id);
      if (contact == null)
      {
        return new JsonResult("Contact not found") { StatusCode = StatusCodes.Status404NotFound };
      }
      contact.contactName = updatedContact.contactName;
      contact.phoneNumber = updatedContact.phoneNumber;
      contact.bestTimeToContact = updatedContact.bestTimeToContact;
      contact.reasonForCall = updatedContact.reasonForCall;
      contact.notes = updatedContact.notes;
      return new JsonResult(contact);
    }

    [HttpDelete("DeleteContact/{id}")]
    public JsonResult DeleteContact(int id)
    {
      var contact = Contacts.FirstOrDefault(c => c.id == id);
      if (contact == null)
      {
        return new JsonResult("Contact not found") { StatusCode = StatusCodes.Status404NotFound };
      }
      Contacts.Remove(contact);
      return new JsonResult("Contact deleted");
    }
  }
}
