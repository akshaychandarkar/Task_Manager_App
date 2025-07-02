using System;                         // Provides basic system types like DateTime.
using System.Collections.Generic;     // Provides collection types like List<T>.
using System.Linq;                    // Enables LINQ queries on data collections.
using System.Threading.Tasks;         // Enables asynchronous programming.
using Microsoft.AspNetCore.Mvc;       // Provides ASP.NET Core MVC features for building APIs.
using Microsoft.EntityFrameworkCore;  // Enables Entity Framework Core database operations.
using Task_Manager_Backend.Data;      // Imports AppDbContext from your data layer.
using Task_Manager_Backend.Models;    // Imports your TaskItem model.

namespace Task_Manager_Backend.Controllers
{
    [ApiController]                   // Marks this class as an API controller.
    [Route("api/[controller]")]        // Sets route as api/tasks (controller name becomes route).
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _context;  // Your database context for accessing tasks.

        // TimeZoneInfo for IST conversion
        private static readonly TimeZoneInfo IndiaTimeZone =
            TimeZoneInfo.FindSystemTimeZoneById("India Standard Time");

        // Constructor receives AppDbContext instance through dependency injection.
        public TasksController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/tasks?page=1&pageSize=5&status=Completed
        // Returns a paginated list of tasks, with optional filtering by status.
        [HttpGet]
        public async Task<ActionResult<object>> GetTasks(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 5,
            [FromQuery] string? status = null)
        {
            var query = _context.Tasks.AsQueryable();  // Starts building the query.

            if (!string.IsNullOrWhiteSpace(status))   // If status filter provided, apply it.
            {
                query = query.Where(t => t.Status == status);
            }

            var totalCount = await query.CountAsync();                 // Total records count.
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize); // Total pages.

            var tasks = await query
                .OrderByDescending(t => t.CreatedAt)                  // Sort by creation date.
                .Skip((page - 1) * pageSize)                          // Skip items for pagination.
                .Take(pageSize)                                       // Take pageSize items.
                .ToListAsync();

            // Convert each task's CreatedAt to IST.
            foreach (var task in tasks)
            {
                task.CreatedAt = TimeZoneInfo.ConvertTimeFromUtc(task.CreatedAt, IndiaTimeZone);
            }

            // Return paginated tasks with total pages info.
            return Ok(new
            {
                tasks,
                totalPages
            });
        }

        // GET: api/tasks/{id}
        // Returns a single task by ID.
        [HttpGet("{id}")]
        public async Task<ActionResult<TaskItem>> GetTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return NotFound();                      // 404 if not found.

            task.CreatedAt = TimeZoneInfo.ConvertTimeFromUtc(task.CreatedAt, IndiaTimeZone);
            return task;
        }

        // POST: api/tasks
        // Creates a new task.
        [HttpPost]
        public async Task<ActionResult<TaskItem>> CreateTask(TaskItem task)
        {
            task.StartDate = task.StartDate.Date;                      // Normalize start date.
            task.EndDate = task.EndDate.Date;                          // Normalize end date.
            task.CreatedAt = DateTime.UtcNow;                          // Set current UTC time.

            _context.Tasks.Add(task);                                  // Add to DB context.
            await _context.SaveChangesAsync();                         // Save changes.

            task.CreatedAt = TimeZoneInfo.ConvertTimeFromUtc(task.CreatedAt, IndiaTimeZone);

            // Returns 201 Created response with the created task.
            return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
        }

        // PUT: api/tasks/{id}
        // Updates an existing task.
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, TaskItem updatedTask)
        {
            if (id != updatedTask.Id) return BadRequest();             // IDs must match.

            updatedTask.StartDate = updatedTask.StartDate.Date;        // Normalize start date.
            updatedTask.EndDate = updatedTask.EndDate.Date;            // Normalize end date.

            _context.Entry(updatedTask).State = EntityState.Modified;  // Mark as modified.

            try
            {
                await _context.SaveChangesAsync();                     // Save updates.
            }
            catch (DbUpdateConcurrencyException)                       // Handle concurrent edits.
            {
                if (!_context.Tasks.Any(e => e.Id == id))              // Check if task exists.
                    return NotFound();                                 // Return 404 if not found.
                else
                    throw;                                             // Rethrow if other error.
            }

            updatedTask.CreatedAt = TimeZoneInfo.ConvertTimeFromUtc(updatedTask.CreatedAt, IndiaTimeZone);

            return Ok(updatedTask);                                    // Return updated task.
        }

        // DELETE: api/tasks/{id}
        // Deletes a task by ID.
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return NotFound();                       // 404 if not found.

            _context.Tasks.Remove(task);                               // Remove from DB.
            await _context.SaveChangesAsync();                         // Commit changes.

            return NoContent();                                        // Return 204 No Content.
        }
    }
}
