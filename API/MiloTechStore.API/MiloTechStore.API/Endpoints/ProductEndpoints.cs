using Microsoft.EntityFrameworkCore;
using MiloTechStore.API.Data;
using MiloTechStore.API.DTOs;
using MiloTechStore.API.Models;

namespace MiloTechStore.API.Endpoints;

public static class ProductEndpoints
{
    public static void MapProductEndpoints(this WebApplication app)
    {
        app.MapGet("/api/products", async (AppDbContext db) =>
        {
            var products = await db.Products.
            Select(product => new ProductResponse(
                product.Id,
                product.Title,
                product.Description,
                product.Category,
                product.Price,
                product.Stock,
                product.Image)).
                ToListAsync();

            return Results.Ok(products);
        });

        app.MapPost("/api/products", async (CreateProductRequest request, AppDbContext db) =>
        {

            if (string.IsNullOrWhiteSpace(request.Title))
                return Results.BadRequest(new{message = "Product title is required"});


            if (request.Price <= 0)
                return Results.BadRequest(new{message = "Price must be greater than zero"});


            if (request.Stock < 0)
                return Results.BadRequest(new{message = "Stock cannot be negative"});


            if (string.IsNullOrWhiteSpace(request.Description))
                return Results.BadRequest(new{message = "Description is required"});


            if (string.IsNullOrWhiteSpace(request.Image))
                return Results.BadRequest(new{message = "Image is required"});

            var exists = await db.Products.
            AnyAsync(product => product.Title == request.Title);


            if (exists)
                return Results.BadRequest(new{message = "Product already exists"});

            var product = new Product
            {
                Title = request.Title.Trim(),
                Description = request.Description.Trim(),
                Category = request.Category,
                Price = request.Price,
                Stock = request.Stock,
                Image = request.Image.Trim()
            };

            db.Products.Add(product);

            await db.SaveChangesAsync();

            return Results.Ok(product);

        });

        app.MapPost("/api/products/reduce-stock", async (List<StockRequest> items, AppDbContext db) =>
        {
            foreach ( var item in items )
            {
                var product = await db.Products.FindAsync(item.ProductId);

                if (product is null)
                    return Results.NotFound($"Product {item.ProductId} not found");

                if (product.Stock < item.Quantity)
                    return Results.BadRequest($"Not enough stock for {product.Title}");

                product.Stock -= item.Quantity;
            }

            await db.SaveChangesAsync();

            return Results.Ok(new{message = "Stock updated successfully"});
        });
    }
}


