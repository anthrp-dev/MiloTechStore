namespace MiloTechStore.API.DTOs
{
    public record ProductResponse(
        int Id,
        string Title,
        string? Description,
        string? Category,
        decimal Price,
        int Stock,
        string? Image
    );
}
