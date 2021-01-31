using api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace api.Controllers
{
  [ApiController]
  [Route("[controller]")]
  public class MessagesController : ControllerBase
  {
    private readonly IHubContext<MessageHub> _messageHub;

    public MessagesController(IHubContext<MessageHub> messageHub)
    {
      this._messageHub = messageHub;
    }

    [HttpPost]
    public IActionResult Post([FromBody] Message message)
    {
      this._messageHub.Clients.All.SendAsync("MessagePosted", message);

      return Ok();
    }
  }
}
