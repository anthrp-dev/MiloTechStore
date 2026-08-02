namespace MiloTechStore.API.DTOs;

public record StockRequest(
    int ProductId,
    int Quantity
);
