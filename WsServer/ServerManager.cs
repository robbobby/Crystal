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
    private static IHubContext<SignalRHub>? _hubContext;

    public static void RegisterHubContext(IHubContext<SignalRHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public static void Start()
    {
        Settings.Load();
        Envir.Start();
        StartLogProcessing();
    }

    public static void Stop()
    {
        Envir.Stop();
    }

    private static void EnqueueLog(string log)
    {
        var wsLog = NormaliseLog(log);
        Logs.Enqueue(wsLog);
        Console.WriteLine(log); // Keep console output as raw log

        // Send the structured WsLog object to clients
        _hubContext?.Clients.All.SendAsync("ReceiveLog", wsLog).ConfigureAwait(false);
    }

    private static WsLog NormaliseLog(string log)
    {
        string message = log.Trim();
        DateTime timestamp = DateTime.Now;

        if (log.StartsWith("[") && log.Contains("]:"))
        {
            int closeBracketIndex = log.IndexOf("]:", StringComparison.Ordinal);
            if (closeBracketIndex > 0)
            {
                string timestampStr = log.Substring(1, closeBracketIndex - 1);
                if (DateTime.TryParseExact(timestampStr,
                        ["MM/dd/yyyy H:mm:ss", "MM/dd/yyyy HH:mm:ss"],
                        CultureInfo.InvariantCulture,
                        DateTimeStyles.None,
                        out DateTime parsedTime))
                {
                    timestamp = parsedTime;
                    message = log.Substring(closeBracketIndex + 2).Trim();
                }
            }
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
            while (Envir.Running)
            {
                ProcessLogs();
                Thread.Sleep(100);
            }
        });
    }

    private static void ProcessLogs()
    {
        ProcessLogQueue(MessageQueue.Instance.MessageLog, "");
        ProcessLogQueue(MessageQueue.Instance.DebugLog, "[DEBUG] ");
        ProcessLogQueue(MessageQueue.Instance.ChatLog, "[CHAT] ");
    }

    private static void ProcessLogQueue(ConcurrentQueue<string> queue, string prefix)
    {
        while (!queue.IsEmpty && queue.TryDequeue(out var message))
        {
            string cleanedMessage = message.Replace("\r", "").Replace("\n", " ");
            EnqueueLog(prefix + cleanedMessage);
        }
    }
}