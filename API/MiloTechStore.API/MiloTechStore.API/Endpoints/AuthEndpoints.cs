using Microsoft.EntityFrameworkCore;
using MiloTechStore.API.Data;
using MiloTechStore.API.DTOs;
using MiloTechStore.API.Models;

namespace MiloTechStore.API.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this WebApplication app)
    {
        //registro
        app.MapPost("/api/auth/register", async (RegisterRequest request, AppDbContext db) =>
        {
            var existingUser = await db.Users.
                FirstOrDefaultAsync(user => user.Username == request.Username);

            if (existingUser is not null)
            {
                return Results.BadRequest(new
                {
                    message = "Username already exists"
                });
            }

            var user = new User
            {
                Username = request.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                RoleId = 1
            };

            db.Users.Add(user);

            await db.SaveChangesAsync();

            return Results.Ok(new
            {
                message = "User registered successfully"
            });
        });

        //login
        app.MapPost("/api/auth/login", async (LoginRequest request, AppDbContext db) =>
        {
            var user = await db.Users.
                FirstOrDefaultAsync(user => user.Username == request.Username);

            if (user is null)
                return Results.Unauthorized();

            bool passwordValid = BCrypt.Net.BCrypt.Verify(
                request.Password,
                user.PasswordHash);

            if (!passwordValid)
                return Results.Unauthorized();

            return Results.Ok(new
            {
                user.Id,
                user.Username,
                user.RoleId
            });
        });
    }
}
