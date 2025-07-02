using System;                             // Basic .NET types like DateTime.
using System.Collections.Generic;         // For List<T>.
using System.ComponentModel.DataAnnotations; // For [Required] validation attributes.
using System.Linq;                        // For LINQ (not directly used here).
using System.Threading.Tasks;             // For asynchronous programming (not directly used here).

namespace Task_Manager_Backend.Models
{
    // Represents a Task entity; EF Core maps this class to a Tasks table in your database.
    public class TaskItem
    {
        // Primary key (auto-incrementing ID).
        public int Id { get; set; }

        // Title of the task; required field, validated by data annotations.
        [Required]
        public string Title { get; set; }

        // Detailed description of the task; required.
        [Required]
        public string Description { get; set; }

        // Start date of the task; required.
        [Required]
        public DateTime StartDate { get; set; }

        // End date of the task; required.
        [Required]
        public DateTime EndDate { get; set; }

        // Status of the task (e.g., Not Started, In Progress, Completed).
        public string Status { get; set; }

        // Worklog or notes about the work done on this task.
        public string Worklog { get; set; }

        // Priority level of the task (e.g., High, Medium, Low); required.
        [Required]
        public string Priority { get; set; }

        // List of story statistics (e.g., Development, Unit Testing) stored as List<string>.
        public List<string> StoryStats { get; set; }

        // Timestamp when the task was created; automatically set by backend on create.
        public DateTime CreatedAt { get; set; }
    }
}
