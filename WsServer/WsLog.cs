namespace WsServer;

public class WsLog(string message, DateTime timestamp)
{
    public string Message { get; } = message;
    public DateTime Timestamp { get; } = timestamp;
}