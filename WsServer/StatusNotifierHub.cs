using Microsoft.AspNetCore.SignalR;
using Server.MirEnvir;
using Server.MirObjects;
using WsServer.Groups;
using WsServer.Model;

namespace WsServer;

public class ServerStatusNotifier(IHubContext<ServerManagementHub> hubContext)
{
    private void NotifyStatus()
    {
        hubContext.Clients.All.SendAsync("ServerStatus", Envir.Main.Running);
    }

    private void OnPlayerCountChange(int count)
    {
        hubContext.Clients.All.SendAsync("PlayerCount", count);
    }

    private void ConnectionCount(int count)
    {
        hubContext.Clients.All.SendAsync("ConnectionCount", count);
    }

    private void BlockedIpCount(int count)
    {
        hubContext.Clients.All.SendAsync("BlockedIpCount", count);
    }

    private void CycleDelay(int count)
    {
        hubContext.Clients.All.SendAsync("CycleDelay", count);
    }

    private void OnPlayerAdded(PlayerObject player)
    {
        Console.WriteLine($"Player added: {player.Name}");
        var wsPlayer = new List<WsCharacter>
        {
            new WsCharacter
            {
                Id = player.Info.Index,
                Name = player.Name,
                Level = player.Level,
                Class = player.Class,
                Gender = player.Gender
            }
        };

        hubContext.Clients.Group(GroupKeys.Admin.DashboardPlayerList)
            .SendAsync("PlayerAdded", wsPlayer);
    }

    private void OnPlayerRemoved(PlayerObject player)
    {
        var wsPlayer = new WsCharacter
        {
            Id = player.Info.Index,
            Name = player.Name,
            Level = player.Level,
            Class = player.Class,
            Gender = player.Gender
        };
        hubContext.Clients.Group(GroupKeys.Admin.DashboardPlayerList)
            .SendAsync("PlayerRemoved", wsPlayer);
    }

    public void SetupListeners()
    {
        Envir.Main.OnRunningChange += NotifyStatus;
        Envir.Main.Players.OnListChange += OnPlayerCountChange;
        Envir.Main.Players.OnPlayerAdded += OnPlayerAdded;
        Envir.Main.Players.OnPlayerRemoved += OnPlayerRemoved;
    }
}