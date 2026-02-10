using FlashcardAI.Server.Models;
using Microsoft.EntityFrameworkCore;
using FlashcardAI.Server.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite("Data Source=flashcards.db"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173", "http://localhost:5173/")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .SetIsOriginAllowed(_=>true);
        }
    );
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

var app = builder.Build();
app.UseRouting();

app.UseCors("AllowReactApp");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "Flashcard AI v1");
    });
}


//app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();