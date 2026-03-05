# Umbraco CMS Development Skill

## Document Types
```csharp
[ContentType("productPage")]
[Icon("icon-tag")]
public class ProductPage : ContentModel
{
    [Required]
    public string Title { get; set; }
    
    public decimal Price { get; set; }
    
    [DataType("Umbraco.MediaPicker3")]
    public IEnumerable<IPublishedContent> Images { get; set; }
    
    [DataType("Umbraco.TinyMCE")]
    public IHtmlEncodedString Description { get; set; }
}
```

## Custom Controllers
```csharp
public class ProductController : RenderController
{
    private readonly IProductService _productService;
    
    public ProductController(
        ILogger<ProductController> logger,
        ICompositeViewEngine compositeViewEngine,
        IUmbracoContextAccessor umbracoContextAccessor,
        IProductService productService)
        : base(logger, compositeViewEngine, umbracoContextAccessor)
    {
        _productService = productService;
    }
    
    public override IActionResult Index()
    {
        var model = CurrentPage as ProductPage;
        var enrichedModel = _productService.EnrichProductData(model);
        return View(enrichedModel);
    }
}
```

## Block List Editor
```csharp
[ContentType("heroBlock")]
public class HeroBlock : BlockItemData
{
    public string Title { get; set; }
    public string Subtitle { get. set; }
    public IPublishedContent BackgroundImage { get; set; }
    public Link CallToAction { get; set; }
}
```

## Content Services
```csharp
public class ContentService
{
    private readonly IUmbracoContextFactory _contextFactory;
    
    public IPublishedContent? GetContentByKey(Guid key)
    {
        using var context = _contextFactory.EnsureUmbracoContext();
        return context.UmbracoContext.Content?.GetById(key);
    }
    
    public IEnumerable<IPublishedContent> GetChildren(Guid parentKey)
    {
        var parent = GetContentByKey(parentKey);
        return parent?.Children() ?? Enumerable.Empty<IPublishedContent>();
    }
}
```

## Custom Property Editors
```csharp
[DataEditor("CustomPicker", "Custom Picker", "~/App_Plugins/CustomPicker/picker.html")]
public class CustomPickerEditor : DataEditor
{
    public CustomPickerEditor(IDataValueEditorFactory dataValueEditorFactory)
        : base(dataValueEditorFactory)
    {
    }
}
```

## Best Practices
- Use strongly-typed models
- Implement caching for frequently accessed content
- Use composition for reusable content blocks
- Follow Umbraco naming conventions
- Use dependency injection
- Implement custom dashboards for editors
