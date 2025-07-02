using System;                       // Basic system types.
using System.Collections.Generic;   // List<T> and other collections.
using System.Linq;                  // LINQ extensions.
using System.Text.Json;             // For JSON serialization of storyStats.
using System.Threading.Tasks;       // For async operations.
using Microsoft.EntityFrameworkCore; // EF Core base classes.
using Task_Manager_Backend.Models;   // Your TaskItem entity.

namespace Task_Manager_Backend.Data
{
    // AppDbContext defines your database schema and behavior for EF Core.
    public class AppDbContext : DbContext
    {
        // Constructor receives DbContextOptions from dependency injection, passes to base.
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // DbSet representing the Tasks table; lets you query and save TaskItem entities.
        public DbSet<TaskItem> Tasks { get; set; }

        // Override this method to configure entity mappings, conversions, and relationships.
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure TaskItem entity
            modelBuilder.Entity<TaskItem>(builder =>
            {
                // Configure StoryStats property to store List<string> as JSON string in DB.
                builder.Property(t => t.StoryStats)
                    .HasConversion(
                        v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),       // Serialize List<string> -> JSON string on save
                        v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions)null) // Deserialize JSON string -> List<string> on read
                    );
            });
        }
    }
}
