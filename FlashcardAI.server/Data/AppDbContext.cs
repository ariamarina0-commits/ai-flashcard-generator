using Microsoft.EntityFrameworkCore;
using FlashcardAI.Server.Models;

namespace FlashcardAI.Server.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}
    public DbSet<User> Users{get;set;}
    public DbSet<FlashcardEntity> Flashcards {get; set;}
}