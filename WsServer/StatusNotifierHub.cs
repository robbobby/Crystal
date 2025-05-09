using Microsoft.AspNetCore.SignalR;
using Server.MirEnvir;

namespace WsServer;

public class ServerStatusNotifier(IHubContext<SignalRHub> hubContext)
{
    private Task NotifyStatus()
    {
        return hubContext.Clients.All.SendAsync("ServerStatus", Envir.Main.Running);
    }

    public void SetupListeners()
    {
        Envir.Main.OnRunningChange += () => NotifyStatus();
    }
}