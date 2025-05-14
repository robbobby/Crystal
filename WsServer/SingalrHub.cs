using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.SignalR;
using Server.MirEnvir;

namespace WsServer;

[SuppressMessage("CodeQuality", "CA1822:Mark members as static", 
    Justification = "SignalR hub methods must be instance methods")]
public class ServerManagementHub(IHubContext<ServerManagementHub> hubContext) : Hub
{
    public static readonly string HubUrl = "/ws/signalrHub";

    private int adminConnectionCount;
    public override Task OnConnectedAsync()
    {
        var client = Context.ConnectionId;
        SendServerStatus(client);
        AdminConnectionCount(++adminConnectionCount);
        UserConnectionCount(adminConnectionCount);
        return base.OnConnectedAsync();
    }
    
    public override Task OnDisconnectedAsync(Exception? exception)
    {
        AdminConnectionCount(--adminConnectionCount);
        UserConnectionCount(adminConnectionCount); // TODO: Seperate user count when auth is implemented
        return base.OnDisconnectedAsync(exception);
    }

        
    [HubMethodName("StartServer")]
    public void StartServer()
    {
        ServerManager.Start();
    }

    [HubMethodName("StopServer")]
    public void StopServer()
    {
        ServerManager.Stop();
    }
    
    [HubMethodName("RebootServer")]
    public void RebootServer()
    {
        ServerManager.Reboot();
    }
    
    private void AdminConnectionCount(int count)
    {
        hubContext.Clients.All.SendAsync("AdminConnectionCount", count);
    }

    private void UserConnectionCount(int count)
    {
        hubContext.Clients.All.SendAsync("UserConnectionCount", count);
    }
    
    private void SendServerStatus(string client)
    {
        hubContext.Clients.Client(client).SendAsync("ServerStatus", Envir.Main.Running);
    }
}