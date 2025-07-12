package com.ecommerce.ecommercebackend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data; // From Lombok

import java.util.Set;

@Document(collection = "users")
@Data // Generates getters, setters, toString, equals, hashCode
public class User {
    @Id
    private String id;
    private String username;
    private String password; // Store hashed password
    private String email;
    private Set<String> roles; // e.g., "ROLE_USER", "ROLE_ADMIN"
}