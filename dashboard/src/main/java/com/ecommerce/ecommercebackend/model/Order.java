package com.ecommerce.ecommercebackend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "orders")
@Data
public class Order {
    @Id
    private String id;
    private String userId;
    private List<OrderItem> items;
    private double totalAmount;
    private String status; // e.g., "PENDING", "COMPLETED", "CANCELLED"
    private LocalDateTime orderDate;
}

@Data
class OrderItem {
    private String productId;
    private String productName;
    private int quantity;
    private double price;
}