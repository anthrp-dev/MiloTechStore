namespace MiloTechStore.API.DTOs
{
    public record CreateProductRequest(
        string Title,
        string? Description,
        string? Category,
        decimal Price,
        int Stock,
        string? Image
    );
}