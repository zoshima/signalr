using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace api.Models 
{
  public class Message
  {
    public string Id { get; set; }
    public string Data { get; set; }
    public DateTime Date { get; set; }

    public Message() 
    {
    }
  }

  public class MessageHub : Hub 
  {
    public async Task Broadcast(Message message) 
    {
      await Clients.All.SendAsync("NewMessage", message);
    }
  }
}
