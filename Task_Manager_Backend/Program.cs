using Microsoft.EntityFrameworkCore; // Imports Entity Framework Core for database access.
using Task_Manager_Backend.Data;     // Imports your project’s Data namespace to use AppDbContext.

var builder = WebApplication.CreateBuilder(args); // Creates the builder for configuring services and the app pipeline.

// Adds the AppDbContext to the dependency injection system and configures it to use SQL Server.
// It uses the connection string named "DefaultConnection" from appsettings.json or environment.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Adds Cross-Origin Resource Sharing (CORS) policy so your React frontend can call this API from another domain/port.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",                 // Defines a CORS policy named "AllowFrontend".
        builder => builder.WithOrigins("http://localhost:3000") // Allows only requests coming from localhost:3000.
                          .AllowAnyHeader()                    // Allows any HTTP headers in requests.
                          .AllowAnyMethod());                  // Allows all HTTP methods (GET, POST, PUT, DELETE).
});

// Adds support for controllers so your API endpoints can handle HTTP requests.
builder.Services.AddControllers();

// Adds endpoints explorer used by Swagger.
builder.Services.AddEndpointsApiExplorer();

// Adds Swagger services so API documentation and UI are generated.
builder.Services.AddSwaggerGen();

var app = builder.Build(); // Builds the configured web application.

// Enables Swagger middleware and UI for development and production environments.
// This makes your API available at /swagger for testing and documentation.
if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();    // Enables serving Swagger JSON.
    app.UseSwaggerUI();  // Enables the Swagger web interface.
}

// Enables the configured CORS policy globally so the frontend can make API calls.
app.UseCors("AllowFrontend");

// Redirects HTTP requests to HTTPS automatically for security.
app.UseHttpsRedirection();

// Enables authorization middleware; required if you add authentication or protect endpoints.
app.UseAuthorization();

// Maps HTTP routes to the controllers in your application so they can respond to requests.
app.MapControllers();

// Starts the web server to listen for incoming requests.
app.Run();
