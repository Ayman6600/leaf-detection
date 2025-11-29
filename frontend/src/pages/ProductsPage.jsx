import React from "react";
import { Package, Star, Leaf, ShoppingCart, Heart, Clock, Pill, Coffee, FlaskConical, Box, LeafyGreen, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

const ProductsPage = () => {
  const products = [
    {
      name: "Gymnema Leaf Extract Powder",
      description: "Premium quality dried and ground leaf extract",
      price: "$24.99",
      rating: 4.8,
      reviews: 156,
      icon: LeafyGreen,
      category: "Extract",
      inStock: true,
    },
    {
      name: "Gymnema Capsules (500mg)",
      description: "Standardized extract capsules for easy consumption",
      price: "$29.99",
      rating: 4.9,
      reviews: 243,
      icon: Pill,
      category: "Supplement",
      inStock: true,
    },
    {
      name: "Organic Gymnema Tea",
      description: "Premium herbal tea blend with natural benefits",
      price: "$19.99",
      rating: 4.7,
      reviews: 98,
      icon: Coffee,
      category: "Tea",
      inStock: true,
    },
    {
      name: "Gymnema Liquid Extract",
      description: "Concentrated tincture for maximum absorption",
      price: "$34.99",
      rating: 4.9,
      reviews: 187,
      icon: FlaskConical,
      category: "Tincture",
      inStock: false,
    },
    {
      name: "Gymnema Combo Pack",
      description: "Best value pack with capsules and tea",
      price: "$44.99",
      rating: 5.0,
      reviews: 312,
      icon: Box,
      category: "Bundle",
      inStock: true,
      featured: true,
    },
    {
      name: "Gymnema Leaf Powder",
      description: "Raw leaf powder for traditional preparations",
      price: "$17.99",
      rating: 4.6,
      reviews: 76,
      icon: Leaf,
      category: "Powder",
      inStock: true,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 rounded-lg bg-primary/10">
                <Package className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-semibold mb-4">
              Premium Products
            </h1>
            <p className="text-lg text-muted-foreground">
              High-quality Gymnema sylvestre products for your wellness journey
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Products Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => {
            const Icon = product.icon;
            return (
              <Card key={index} className="h-full border shadow-sm flex flex-col">
                <CardHeader>
                  {product.featured && (
                    <Badge className="w-fit mb-3 font-semibold">
                      Featured
                    </Badge>
                  )}
                  <div className="mb-6 flex h-32 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-16 w-16 text-primary" />
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{product.name}</CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          <span className="ml-1 text-sm font-semibold">{product.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ({product.reviews} reviews)
                        </span>
                      </div>
                      <Badge variant="secondary" className="mb-2">{product.category}</Badge>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-lg"
                    >
                      <Heart className="h-5 w-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <CardDescription className="text-base mb-4">
                    {product.description}
                  </CardDescription>
                  <div className="flex items-center gap-2 text-sm">
                    {product.inStock ? (
                      <>
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span className="text-foreground font-medium">In Stock</span>
                      </>
                    ) : (
                      <>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground font-medium">Coming Soon</span>
                      </>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-3xl font-semibold text-primary">{product.price}</div>
                    <div className="text-xs text-muted-foreground">per unit</div>
                  </div>
                  <Button
                    size="lg"
                    className="font-semibold rounded-lg"
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {product.inStock ? "Add to Cart" : "Notify Me"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
