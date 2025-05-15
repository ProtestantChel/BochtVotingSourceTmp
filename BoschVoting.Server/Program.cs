

using System;
using System.Net;
using System.Numerics;
using System.Text;

var builder = WebApplication.CreateBuilder(args);




builder.Services.AddCors();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddControllers().AddNewtonsoftJson();

var app = builder.Build();


app.UseDefaultFiles();
app.UseStaticFiles();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseHttpsRedirection();
app.UseCors(x => x
      .AllowAnyMethod()
      .AllowAnyHeader()
      .SetIsOriginAllowed(origin => true)
      .AllowCredentials());

app.UseAuthorization();

app.MapControllers();
app.UseStaticFiles();
app.MapFallbackToFile("/index.html");
ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };


app.Run();
