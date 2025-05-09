using Microsoft.AspNetCore.SignalR;
using Server.MirEnvir;

namespace WsServer;

public class SignalRHub : Hub
{
    private readonly IHubContext<SignalRHub> _currentHubContext;

    public SignalRHub(IHubContext<SignalRHub> hubContext)
    {
        _currentHubContext = hubContext;
    }

    public override Task OnConnectedAsync()
    {
        Console.WriteLine("Client connected: " + Context.ConnectionId);
        var client = Context.ConnectionId;
        SendServerStatus(client);
        return base.OnConnectedAsync();
    }

    private void SendServerStatus()
    {
        _currentHubContext.Clients.All.SendAsync("ServerStatus", Envir.Main.Running);
    }
    
    private void SendServerStatus(string client)
    {
        _currentHubContext.Clients.Client(client).SendAsync("ServerStatus", Envir.Main.Running);
    }

    public Task StartServer()
    {
        Console.WriteLine("StartServer called via SignalR");
        ServerManager.Start();
        return Clients.All.SendAsync("ServerStatus", "Server started");
    }

    public Task StopServer()
    {
        Console.WriteLine("StopServer called via SignalR");
        ServerManager.Stop();
        return Clients.All.SendAsync("ServerStatus", "Server stopped");
    }

    public Task SendText(string text)
    {
        return Clients?.All.SendAsync("ReceiveText", text) ?? Task.CompletedTask;
    }

    public Task SendLog(string logMessage)
    {
        return Clients.All.SendAsync("ReceiveLog", logMessage);
    }
}