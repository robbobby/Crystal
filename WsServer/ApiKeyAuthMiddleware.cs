using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Primitives;

namespace WsServer;

public class ApiKeyAuthMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IConfiguration _config;

    public ApiKeyAuthMiddleware(RequestDelegate next, IConfiguration config)
    {
        _next = next;
        _config = config;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        Console.WriteLine($"Request Path: {context.Request.Path}");

        if (!context.Request.Path.StartsWithSegments($"{ServerManagementHub.HubUrl}/negotiate", StringComparison.OrdinalIgnoreCase))
        {
            await _next(context);
            return;
        }


        var apiKey = _config["WsApiKey"];

        if (string.IsNullOrEmpty(apiKey))
        {
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            await context.Response.WriteAsync("API key is not configured.");
            return;
        }

        if (context.Request.Headers.TryGetValue("Authorization", out var headerKey) && RemoveBearer(headerKey)
            == apiKey)
        {
            Console.WriteLine($"Header Key: {headerKey}");
            await _next(context);
            return;
        }

        if (context.Request.Query.TryGetValue("apiKey", out var queryKey) && queryKey == apiKey)
        {
            await _next(context);
            return;
        }

        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        await context.Response.WriteAsync("Unauthorized");
    }

    private string RemoveBearer(StringValues headerKey)
    {
        if (headerKey.ToString().StartsWith("Bearer "))
        {
            return headerKey.ToString().Substring(7);
        }

        return headerKey.ToString();
    }
}

public static class ApiKeyAuthMiddlewareExtensions
{
    public static IApplicationBuilder UseWsApiKeyAuth(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<ApiKeyAuthMiddleware>();
    }
}