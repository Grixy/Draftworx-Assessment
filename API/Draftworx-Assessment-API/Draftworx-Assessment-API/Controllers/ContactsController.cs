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
    private static List<Contact> Contacts = new List<Contact>();
    private static int NextId = 1;

    [HttpGet]
    public JsonResult GetContacts()
    {
      return new JsonResult(Contacts);
    }

    [HttpPost]
    public JsonResult CreateContact([FromBody] Contact newContact)
    {
      newContact.Id = NextId++;
      Contacts.Add(newContact);
      return new JsonResult(newContact);
    }

    [HttpGet("{id}")]
    public JsonResult GetContact(int id)
    {
      var contact = Contacts.FirstOrDefault(c => c.Id == id);
      if (contact == null)
      {
        return new JsonResult("Contact not found") { StatusCode = StatusCodes.Status404NotFound };
      }
      return new JsonResult(contact);
    }

    [HttpPut("{id}")]
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

    [HttpDelete("{id}")]
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
