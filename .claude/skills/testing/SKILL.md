# Testing Development Skill

## Unit Tests (.NET)
```csharp
public class OrderServiceTests
{
    private readonly Mock<IOrderRepository> _repository;
    private readonly OrderService _service;
    
    public OrderServiceTests()
    {
        _repository = new Mock<IOrderRepository>();
        _service = new OrderService(_repository.Object);
    }
    
    [Fact]
    public async Task CreateOrder_ValidInput_ReturnsCreatedOrder()
    {
        // Arrange
        var command = new CreateOrderCommand("customer-1", items);
        
        // Act
        var result = await _service.CreateOrderAsync(command);
        
        // Assert
        result.Should().NotBeNull();
        result.IsSuccess.Should().BeTrue();
        _repository.Verify(r => r.AddAsync(It.IsAny<Order>()), Times.Once);
    }
    
    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public async Task CreateOrder_InvalidCustomerId_ReturnsError(string customerId)
    {
        // Arrange & Act
        var result = await _service.CreateOrderAsync(new CreateOrderCommand(customerId, items));
        
        // Assert
        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("VALIDATION_ERROR");
    }
}
```

## Integration Tests (.NET)
```csharp
public class OrderApiTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;
    
    public OrderApiTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }
    
    [Fact]
    public async Task CreateOrder_ValidRequest_Returns201()
    {
        // Arrange
        var command = new CreateOrderCommand("customer-1", items);
        
        // Act
        var response = await _client.PostAsJsonAsync("/api/orders", command);
        
        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var order = await response.Content.ReadFromJsonAsync<OrderDto>();
        order.Should().NotBeNull();
    }
}
```

## Component Tests (Vue)
```typescript
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ProductCard from './ProductCard.vue'

describe('ProductCard', () => {
  it('displays product information correctly', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: {
          id: '1',
          name: 'Test Product',
          price: 99.99
        }
      }
    })
    
    expect(wrapper.find('.product-card__title').text()).toBe('Test Product')
    expect(wrapper.find('.product-card__price').text()).toContain('99.99')
  })
  
  it('emits add-to-cart event on button click', async () => {
    const wrapper = mount(ProductCard, {
      props: { product: mockProduct }
    })
    
    await wrapper.find('.product-card__button').trigger('click')
    
    expect(wrapper.emitted('add-to-cart')).toBeTruthy()
    expect(wrapper.emitted('add-to-cart')?.[0]).toEqual([mockProduct.id])
  })
})
```

## E2E Tests (Playwright)
```typescript
import { test, expect } from '@playwright/test'

test('user can create order', async ({ page }) => {
  await page.goto('/products')
  
  await page.click('[data-testid="product-1"]')
  await page.fill('[data-testid="quantity"]', '2')
  await page.click('[data-testid="add-to-cart"]')
  
  await page.goto('/cart')
  await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(1)
  
  await page.click('[data-testid="checkout"]')
  await page.fill('[data-testid="email"]', 'test@example.com')
  await page.click('[data-testid="place-order"]')
  
  await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
})
```

## Test Data Builders
```csharp
public class OrderBuilder
{
    private string _customerId = "customer-1";
    private List<OrderItem> _items = new();
    
    public OrderBuilder WithCustomer(string customerId)
    {
        _customerId = customerId;
        return this;
    }
    
    public OrderBuilder WithItem(string productId, int quantity, decimal price)
    {
        _items.Add(new OrderItem(productId, quantity, price));
        return this;
    }
    
    public Order Build()
    {
        return new Order(_customerId, _items);
    }
}

// Usage
var order = new OrderBuilder()
    .WithCustomer("customer-1")
    .WithItem("product-1", 2, 99.99m)
    .Build();
```

## Best Practices
- Unit tests: >80% code coverage
- Integration tests: All critical paths
- E2E tests: Main user flows
- Test behavior, not implementation
- Use AAA pattern (Arrange, Act, Assert)
- One assertion per test (when possible)
- Use test data builders
- Mock external dependencies
- Use TestContainers for integration tests
- Run tests in CI/CD pipeline
