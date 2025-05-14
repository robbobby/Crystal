using Microsoft.AspNetCore.SignalR;
using Server.MirEnvir;

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

    public void SetupListeners()
    {
        Envir.Main.OnRunningChange += NotifyStatus;
        Envir.Main.Players.OnListChange += OnPlayerCountChange;
    }
}