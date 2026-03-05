# .NET 9 Development Skill

## Core Patterns

### CQRS with MediatR
```csharp
// Command
public record CreateOrderCommand(string CustomerId, List<OrderItemDto> Items) 
    : IRequest<Result<Order>>;

// Handler
public class CreateOrderHandler : IRequestHandler<CreateOrderCommand, Result<Order>>
{
    public async Task<Result<Order>> Handle(CreateOrderCommand request, CancellationToken ct)
    {
        // Implementation
    }
}
```

### Result Pattern
```csharp
public class Result<T>
{
    public bool IsSuccess { get; init; }
    public T? Value { get; init; }
    public Error? Error { get; init; }
}
```

### FluentValidation
```csharp
public class CreateOrderValidator : AbstractValidator<CreateOrderCommand>
{
    public CreateOrderValidator()
    {
        RuleFor(x => x.CustomerId).NotEmpty();
        RuleFor(x => x.Items).NotEmpty();
    }
}
```

### Minimal APIs
```csharp
app.MapPost("/api/orders", async (CreateOrderCommand cmd, IMediator mediator) =>
{
    var result = await mediator.Send(cmd);
    return result.IsSuccess ? Results.Created($"/api/orders/{result.Value!.Id}", result.Value)
                            : Results.BadRequest(result.Error);
});
```

### Entity Framework
```csharp
public class AppDbContext : DbContext
{
    public DbSet<Order> Orders => Set<Order>();
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
```

### Structured Logging
```csharp
_logger.LogInformation("Order {OrderId} created for customer {CustomerId}", order.Id, order.CustomerId);
```

## Best Practices
- Always use async/await for I/O
- Include CancellationToken
- Validate with FluentValidation
- Use Result pattern for error handling
- Structured logging with Serilog
- No hardcoded values
- Repository pattern for data access
