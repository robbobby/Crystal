using System.Collections.Concurrent;
using System.Globalization;
using Microsoft.AspNetCore.SignalR;
using Server;
using Server.MirEnvir;

namespace WsServer;

public static class ServerManager
{
    private static Envir Envir => Envir.Main;
    private static readonly ConcurrentQueue<WsLog> Logs = new();
    private static IHubContext<ServerManagementHub>? _hubContext;

    public static void RegisterHubContext(IHubContext<ServerManagementHub> hubContext)
    {
        if (_hubContext != null)
            return;
        _hubContext = hubContext;
        StartLogProcessing();
    }

    public static void Start()
    {
        Settings.Load();
        Envir.Start();
    }

    public static void Stop()
    {
        Envir.Stop();
    }

    private static void EnqueueLog(string log, LogType type)
    {
        var wsLog = NormaliseLog(log);
        Logs.Enqueue(wsLog);
        
        _hubContext?.Clients.All.SendAsync("ReceiveLog", wsLog, type.ToString()).ConfigureAwait(false);
    }

    private static WsLog NormaliseLog(string log)
    {
        string message = log.Trim();
        DateTime timestamp = DateTime.Now;

        if (!log.StartsWith("[") || !log.Contains("]:"))
        {
            return new WsLog(message, timestamp);
        }

        int closeBracketIndex = log.IndexOf("]:", StringComparison.Ordinal);
        if (closeBracketIndex > 0)
        {
            message = log.Substring(closeBracketIndex + 2).Trim();
        }

        return new WsLog(message, timestamp);
    }

    public static List<WsLog> GetLogs()
    {
        var logList = new List<WsLog>();
        while (Logs.TryDequeue(out var log))
        {
            logList.Add(log);
        }

        return logList;
    }

    private static void StartLogProcessing()
    {
        Task.Run(() =>
        {
            while (true)
            {
                SendMonsterCount();
                ProcessLogs();
                Thread.Sleep(1000);
            }
        });
    }

    private static void SendMonsterCount()
    {
        _hubContext?.Clients.All.SendAsync("MonsterCount", Envir.Main.MonsterCount).ConfigureAwait(false);
    }

    private static void ProcessLogs()
    {
        ProcessLogQueue(MessageQueue.Instance.MessageLog, LogType.Server);
        ProcessLogQueue(MessageQueue.Instance.DebugLog, LogType.Debug);
        ProcessLogQueue(MessageQueue.Instance.ChatLog, LogType.Chat);
    }

    private static void ProcessLogQueue(ConcurrentQueue<string> queue, LogType type)
    {
        while (!queue.IsEmpty && queue.TryDequeue(out var message))
        {
            string msg = message.Replace("\r", "").Replace("\n", " ");
            EnqueueLog(msg, type);
        }
    }

    public static void Reboot()
    {
        Envir.Reboot();
    }
}