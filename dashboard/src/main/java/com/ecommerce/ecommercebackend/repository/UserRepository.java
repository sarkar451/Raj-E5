package com.ecommerce.ecommercebackend.repository;

import com.ecommerce.ecommercebackend.model.User;
import com.ecommerce.ecommercebackend.model.Product;
import com.ecommerce.ecommercebackend.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
}

public interface ProductRepository extends MongoRepository<Product, String> {
    // Custom queries if needed
}

public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByUserId(String userId);
}