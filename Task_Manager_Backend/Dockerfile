# Build stage: create a temporary container for building the app
# Uses .NET SDK image for building the project
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build   

# Set working directory inside the container
WORKDIR /src  

# Copy the project file to restore dependencies
COPY Task_Manager_Backend.csproj ./ 

# Restore NuGet packages
RUN dotnet restore "Task_Manager_Backend.csproj" 

# Copy the rest of your backend code
COPY . .   

# Build and publish the app to the /app/publish folder for optimized deployment
RUN dotnet publish "Task_Manager_Backend.csproj" -c Release -o /app/publish 

# Runtime stage: create a lightweight image for running the app
# Uses ASP.NET Core runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0  

# Set working directory
WORKDIR /app

# Copy published files from build stage
COPY --from=build /app/publish .

# Expose port 5000 so the app is accessible outside the container
EXPOSE 5000

# Define the command to start the app when the container runs
ENTRYPOINT ["dotnet", "Task_Manager_Backend.dll"] 

