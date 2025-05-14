using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.SignalR;
using Server.MirEnvir;
using WsServer.Groups;
using WsServer.Model;

namespace WsServer;

[SuppressMessage("CodeQuality", "CA1822:Mark members as static",
    Justification = "SignalR hub methods must be instance methods")]
public class ServerManagementHub(IHubContext<ServerManagementHub> hubContext) : Hub
{
    public static readonly string HubUrl = "/ws/signalrHub";

    private int adminConnectionCount;

    public override Task OnConnectedAsync()
    {
        AdminConnectionCount(++adminConnectionCount, Clients.All);
        UserConnectionCount(adminConnectionCount, Clients.All);
        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        AdminConnectionCount(--adminConnectionCount, Clients.All);
        UserConnectionCount(adminConnectionCount, Clients.All);
        return base.OnDisconnectedAsync(exception);
    }

    [HubMethodName("InitialState")]
    public void InitialState()
    {
        SendServerStatus(Context.ConnectionId);
        AdminConnectionCount(adminConnectionCount, Clients.Caller);
        UserConnectionCount(adminConnectionCount, Clients.Caller);
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

    [HubMethodName("PlayerList")]
    public async Task PlayerList()
    {
        var players = Envir.Main.Players;
        var playerList = players.Select(p => new WsCharacter
        {
            Id = p.Info.Index,
            Name = p.Name,
            Level = p.Level,
            Class = p.Class,
            Gender = p.Gender
        });

        await Groups.AddToGroupAsync(Context.ConnectionId, GroupKeys.Admin.DashboardPlayerList);
        await hubContext.Clients.Group(GroupKeys.Admin.DashboardPlayerList)
            .SendAsync("GroupTest", $"Testing group membership for {Context.ConnectionId}");

        SendPlayerList(playerList, [Clients.Caller]);
    }

    private void SendPlayerList(IEnumerable<WsCharacter> playerList, ISingleClientProxy[] client)
    {
        foreach (var c in client)
        {
            c.SendAsync("PlayerAdded", playerList);
        }
    }

    private void AdminConnectionCount(int count, IClientProxy clients)
    {
        hubContext.Clients.All.SendAsync("AdminConnectionCount", count);
    }

    private void UserConnectionCount(int count, IClientProxy clients)
    {
        hubContext.Clients.All.SendAsync("UserConnectionCount", count);
    }

    private void SendServerStatus(string client)
    {
        hubContext.Clients.Client(client).SendAsync("ServerStatus", Envir.Main.Running);
    }
}