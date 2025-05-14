using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Server;
using Server.MirEnvir;
using WsServer;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();
builder.Services.AddSingleton<ServerManagementHub>();

builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
builder.Configuration.AddEnvironmentVariables();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .SetIsOriginAllowed(_ => true);
    });
});

builder.Services.AddSingleton<ServerStatusNotifier>();


var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseWebSockets();
app.UseRouting();

app.UseCors();

app.UseAuthorization();

app.UseWsApiKeyAuth();

app.UseEndpoints(endpoints =>
{
    endpoints.MapHub<ServerManagementHub>(ServerManagementHub.HubUrl);
});


var hubContext = app.Services.GetRequiredService<IHubContext<ServerManagementHub>>();
ServerManager.RegisterHubContext(hubContext);

app.Services.GetRequiredService<ServerStatusNotifier>()
    .SetupListeners();

app.Run();