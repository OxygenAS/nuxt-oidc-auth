# MedusaJS 2.x Development Skill

## Custom Workflows
```typescript
import { createWorkflow, WorkflowResponse } from "@medusajs/workflows-sdk"

export const customOrderWorkflow = createWorkflow(
  "custom-order-workflow",
  function (input) {
    const validated = validateOrderStep(input)
    const processed = processOrderStep(validated)
    const notified = notifyCustomerStep(processed)
    return new WorkflowResponse(notified)
  }
)
```

## Admin Extensions
```typescript
import { defineWidgetConfig } from "@medusajs/admin-shared"

export default defineWidgetConfig({
  zone: "product.details.after",
  widget: ({ data }) => {
    return (
      <div>
        <h2>Product Analytics</h2>
        <ProductStats productId={data.product.id} />
      </div>
    )
  },
})
```

## Custom Services
```typescript
class CustomOrderService extends TransactionBaseService {
  async createCustomOrder(data: CreateOrderInput): Promise<Order> {
    return await this.atomicPhase_(async (manager) => {
      const orderRepo = manager.getRepository(Order)
      const order = orderRepo.create(data)
      return await orderRepo.save(order)
    })
  }
  
  async getOrderWithDetails(orderId: string): Promise<Order> {
    const orderRepo = this.manager_.getRepository(Order)
    return await orderRepo.findOne({
      where: { id: orderId },
      relations: ["items", "customer", "shipping_address"]
    })
  }
}
```

## Event Subscribers
```typescript
class OrderSubscriber {
  constructor({ eventBusService }) {
    eventBusService.subscribe("order.placed", this.handleOrderPlaced)
  }
  
  handleOrderPlaced = async (data) => {
    // Send notification
    // Update inventory
    // Trigger fulfillment
  }
}
```

## API Routes
```typescript
export default (router) => {
  router.post("/store/custom-checkout", async (req, res) => {
    const customOrderService = req.scope.resolve("customOrderService")
    const result = await customOrderService.createCustomOrder(req.body)
    res.json({ order: result })
  })
}
```

## Best Practices
- Use workflows for complex operations
- Extend admin UI with widgets
- Implement custom services for business logic
- Subscribe to events for side effects
- Use atomic phases for transactions
- Follow MedusaJS plugin structure
